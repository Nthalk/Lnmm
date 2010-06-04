var sys = require("sys");
var WebServer = require("lnmm/lib/Web/Server").Server;
var Observer = require("lnmm/lib/Observable").Observable;
var MySQL = require("lnmm/lib/Data/Base/MySQL/Server").Server;
var Memcache = require("lnmm/lib/Data/Cache/Memcache").Memcache;
var safely = require("lnmm/lib/Safe").safely;

var mysql_opts = {};
var memcache_opts = {};
var web_opts = {port:8080};
process.argv.forEach(function (val, index, array) {
  if(val.match("--mysql-pass=")){
    mysql_opts.pass = val.split('=',2)[1];
  }
  if(val.match("--mysql-user=")){
    mysql_opts.user = val.split('=',2)[1];
  }
});

var mysql = new MySQL(mysql_opts);
var mem = new Memcache(memcache_opts);

var ws = new WebServer(web_opts);
ws.route("/",function(req,resp){
  resp.writeHead(200);
  var o = new Observer();
  
  o.when(['username','session'],safely(function(username,session){
    resp.write("User: " + sys.inspect(username[0].name) + "\n");
    resp.write("Session: " + sys.inspect(session[0]));
    resp.end();
  }));
  
  mysql.query("select 'guest' as name;",null,o.relay("username"));
  mem.get("session-info",o.relay("session"));
  
});

ws.start();

