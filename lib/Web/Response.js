var Class = require("../Class");
var fs = require("fs");
var path = require("path");
var Mime = require("../Mime");
var _ = require("../Underscore");

exports.Response = Class.extend({
  _resp: null,
  _headers_sent: false,
  _headers: null,
  _code: null,
  
  init: function(resp){
    this._resp = resp;
    this._headers = {};
    this._code = 200;
  },
  
  respond: function(code,response){
    if(typeof response === "undefined"){
      response = code;
    }else{
      this._code = code;
    }
    this.headerSend();
    this._resp.end(response);
  },
  
  headerSend: function(){
    if(!this._headers_sent){
      this._headers_sent = true;
      this._resp.writeHead(this._code,this._headers);
    }else{
      throw new Error("Cannot send the headers, headers already sent.");
    }
  },
  
  header: function(key,value){
    if(typeof key === "object"){
      var n;
      for(n in key){
        this._headers[n] = key[n];
      } 
    }else{
      this._headers[key] = value;
    }
  },
  
  write: function(data){
    this.headerSend();
    this._resp.write(data);
  },
  
  serveFile: function(file,not_found_callback){
    var self = this;
    path.exists(file,function(exists){if(exists){
      self._resp.writeHead(200,{"Content-Type": Mime.lookup(file)});
      var stream = fs.createReadStream(file);
      stream.addListener('data',function(data){
        self._resp.write(data);
      });
      stream.addListener('close',function(){
        self._resp.end();
      });
    }else if(not_found_callback){
      not_found_callback(self);
    }else{
      self.respond(404,"File not found");
    }});
  }
});
