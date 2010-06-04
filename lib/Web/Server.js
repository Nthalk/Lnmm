var Class = require("../Class");
var Http = require("http");
var Request = require("./Request").Request;
var Response = require("./Response").Response;
var sys = require("sys");

// Default options
var default_port = 80;
var default_listen = null;
var default_host = /.*/;
var default_log = sys.log;
var default_request_wrapper = function(request){return new Request(request);};
var default_response_wrapper = function(response){return new Response(response);};
var default_not_found = function(req,resp){
  resp.writeHead(404, {'Content-Type': 'text/plain'});
  resp.end("404 not found.");
};

// The actual class
exports.Server = Class.extend({
  // Member variables
  _routes: null, // looks like [[host_test,[[url_test,callback(req,resp)]]]] 
  _options: null,
  _server: null,
  _clients: 0,
  
  log: function(msg){
    if(this._options.log)this._options.log(msg);
  },
  
  // Constructor
  init: function(options){
    options = options ? options : {};
    options.host = options.host ? options.host : default_host;
    options.port = options.port ? options.port : default_port;
    options.listen= options.listen ? options.listen : default_listen;
    options.request_wrapper= options.request_wrapper ? options.request_wrapper : default_request_wrapper;
    options.response_wrapper= options.response_wrapper ? options.response_wrapper : default_response_wrapper;
    options.not_found = options.not_found ? options.not_found : default_not_found;
    if(options.log !== false){
      options.log = options.log ? options.log : default_log;
    }
    
    this._options = options;
    this._routes = [];
  },
  
  // Member functions
  
  wrap: function(fn){
    var self = this;
    return function(req,resp){
      return fn(
        self._options.request_wrapper(req),
        self._options.response_wrapper(resp)
      );
    };
  },
  
  route: function(host,url,callback){
    var routes;
    if(arguments.length === 3){
      routes = [[url,callback]];
    }else if(arguments.length === 1){
      url = host;
      host = this._options.host;
    }else if(arguments.length === 2){
      routes = [[host,url]];
      host = this._options.host; 
    }
    
    // try to find an existing host index
    var host_index = -1;
    var i;
    for(i = 0; i < this._routes.length; i++){
      if(this._routes[i][0] == host){
        host_index = i;
        break;
      }
    }
    
    // Merge or insert
    if(host_index === -1){
      this._routes.push([host,routes]);
    }else{
      this._routes[host_index][1] = this._routes[host_index][1].concat(routes);
    }
    return this;
  },
  
  stop: function(){
    if(this._server){
      this._server.close();
    }
  },
  
  start: function(){
    this.stop();
    
    var self = this;
    this._server = Http.createServer(function(req,resp){try{
      // Check the host and url
      var host;
      if(req.headers.host){
        host = req.headers.host.substr(0,req.headers.host.indexOf(':'));
      }else{
        host = "";
      }
      var url = req.url;
      var host_not_found = self._options.not_found;
      
      self.log("HTTP ( " + self._clients + " ) " + host + " - " + url);
      // Check host
      var i;
      var route;
      for( i=0; i<self._routes.length; i++ ){
        host_route = self._routes[i];
        if(
          typeof host_route[0] === "string" && host_route[0] === host
          || typeof host_route[0] === "function" && host_route[0](host)
        ){
          // Check URL matcher
          var j;
          var route_url;
          for( j=0; j < host_route[1].length; j++ ){
            route_url = host_route[1][j];
            if(
              typeof route_url[0] === "string" && route_url[0] === url
              || typeof route_url[0] === "function" && route_url[0](url)
            ){
              try{
                return route_url[1](req,resp);
              }catch(e){
                self.log("ERROR - " + e.message + "\n" + e.stack);
                resp.writeHead(500);
                resp.end();
              }
            }else if(route_url[0] === 404){
              host_not_found = route_url[1];
            }
          }
        }
      }
      
      host_not_found(req,resp);
    }catch(e){self.log("ERROR - " + e.message + "\n" + e.stack);}});
    
    this._server.addListener('connect',function(){
      self._clients++;
    });
    this._server.addListener('close',function(){
      self._clients--;
    });
    
    this._server.listen(this._options.port, this._options.listen);
    
    this.log("HTTP started on " + this._options.listen + "("+this._options.port+")");
    
    return this;
  }
  
});
