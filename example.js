// Includes
var sys = require("sys");
var url = require("url");

var WebServer = require("lnmm/lib/Web/Server").Server;
var Observer = require("lnmm/lib/Observable").Observable;
var MySQL = require("lnmm/lib/Data/Base/MySQL/Server").Server;
var Memcache = require("lnmm/lib/Data/Cache/Memcache").Memcache;
var Cookies = require("lnmm/lib/Web/Cookies").Cookies;

// Default options
var mysql_opts = {database:'lnmm_blog'};
var memcache_opts = {};
var web_opts = {port:8080};

// Commandline overrides
process.argv.forEach(function (val, index, array) {
  if(val.match("--mysql-")){
    var property = val.split("--mysql-",2)[1];
    var option = property.split('=',2)[0];
    var value = property.split('=',2)[1];
    mysql_opts[option] = value;
  }
  if(val.match("--memcache-")){
    var property = val.split("--memcache-",2)[1];
    var option = val.split('=',2)[0];
    var value = val.split('=',2)[1];
    memcache_opts[option] = value;
  }
  if(val.match("--web-")){
    var property = val.split("--web-",2)[1];
    var option = val.split('=',2)[0];
    var value = val.split('=',2)[1];
    web_opts[option] = value;
  }
});

// Core objects
var mysql = new MySQL(mysql_opts);
var mem = new Memcache(memcache_opts);
var ws = new WebServer(web_opts);

// Configure our Request session cache.
require("lnmm/lib/Web/Request").Request.options.session_cache = mem;
  
// Webserver
ws.route("/",function(req,resp){
  resp.end(req.getSession("test")+"");
});

ws.start();

