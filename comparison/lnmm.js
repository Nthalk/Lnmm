// Includes
var sys = require("sys");
var url = require("url");
var fs = require("fs");

var WebServer = require("lnmm/lib/Web/Server").Server;
var Observer = require("lnmm/lib/Observable").Observable;
var MySQL = require("lnmm/lib/Data/Base/MySQL/Server").Server;
var Memcache = require("lnmm/lib/Data/Cache/Memcache").Memcache;
var Cookies = require("lnmm/lib/Web/Cookies").Cookies;
var Observable = require("lnmm/lib/Observable").Observable;
var Mime = require("lnmm/lib/Mime");
var _ = require("lnmm/lib/Underscore")._;


// Default options
var mysql_opts = {database:"lnmm_blog"};
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
    var option = property.split('=',2)[0];
    var value = property.split('=',2)[1];
    memcache_opts[option] = value;
  }
  if(val.match("--web-")){
    var property = val.split("--web-",2)[1];
    var option = property.split('=',2)[0];
    var value = property.split('=',2)[1];
    if(value === "false"){
      value = false;
    }
    web_opts[option] = value;
  }
});

// Core objects
var mysql = new MySQL(mysql_opts);
var mem = new Memcache(memcache_opts);
mem.connect();
var ws = new WebServer(web_opts);

// Set the template options to understand php templates
_.templateSettings = {
  start       : '<?php',
  end         : '?>',
  interpolate : /<\?php echo (.+?)\?>/g
};

// Configure our Request session cache.
require("lnmm/lib/Web/Request").Request.options.session_cache = mem;
  
var template;
fs.readFile("./template.tpl",function(e,d){
  template = _.template(d.toString());
});

// Webserver
ws.route("/",function(req,resp){
  var o = new Observable();
  
  // Retrieve the user from mysql
  o.when(['user','articles'],function(user,articles){
    resp.header(200,req.getCookies().applyHeader());
    resp.end(template({
      $username: user[0].name,
      $articles: articles[0]
    }));
  });
  
  // Get the user's session.
  req.getSession('user-id',o.relay('session-user-id'));
  // Grab the template
  
  // Grab the past 10 articles
  mysql.query("select * from articles order by time_created limit 10",null,null,o.relay('articles',function(r){
    return r.getArrays();
  }));
  
  // Load the userdata from mysql if possible
  o.on('session-user-id',function(value,err){
    if(!err){
      mysql.query("select * from users where id=?",[userid[0]],null,o.relay("user",function(r){
        return r.getArrays();
      }));
    }else{
      o.fire('user',[{name:'Guest'}]);
    }
  });  
});

ws.start();
