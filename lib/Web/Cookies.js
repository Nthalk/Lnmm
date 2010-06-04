var Class = require("../Class");

var default_path = "/";
var default_expires = 364 * 24 * 60 * 60 * 1000; // One year from now.
var default_pack_length = 1024;

exports.Cookies = Class.extend({
  _req: null,
  _cookies: false,
  _options: false,
  _chances: false,
  
  init: function(req,options){
    if(!options){
      options = {
          path : default_path,
          expires : default_expires,
          pack_length: default_pack_length
      };
    }else{
      options.path = options.path ? options.path : default_path;
      options.expires = options.expires ? options.expires : default_expires;
      options.pack_length = options.pack_length ? options.pack_length : default_pack_length;
    }
    
    this._changes = [];
    this._options = options;
    this._req = req;
  },
  
  get: function(key,if_null){
    if(!this._cookies){
      this.parseCookies();
    }
    if(this._cookies[key]){
      return this._cookies[key];
    }else{
      return if_null;
    }
  },
  
  parseCookies: function(){
    this._cookies = {};
    if(this._req.headers.cookie){
      var cookies_raw = this._req.headers.cookie.substr(this._req.headers.cookie.indexOf('=')+1).split(',');
      var i;
      for(i=0;i<cookies_raw.length;i++){
        var cookie_line = cookies_raw[i].split('=');
        this._cookies[cookie_line[0]] = this.unfilterCookie(cookie_line[1]);
      }
    }
  },
  
  set: function(key,value){
    this._changes.push(key);
    this._cookies[key] = value; 
  },
  
  filterCookie: function(value){
    if(value){
      return value.replace(",","]+[").replace(";",")+(");
    }else{
      return value;
    }
  },
  
  unfilterCookie: function(value){
    if(value){
      return value.replace("]+[",",").replace(")+(",";");
    }else{
      return value;
    }
  },
  
  applyHeader: function(header){
    if(!header){
      header = {};
    }
    
    var cookies = [];
    
    var d = new Date();
    d.setTime(d.getTime() + this._options.expires);
    var extra = "";
    extra += ";expires="+ d.toUTCString();
    extra += ";path=" + this._options.path;
    if(this._options.host){
      extra += ";domain=." + this._options.host.split(':',2)[0];
    }
    
    var cookie = "c0=";
    if(this._changes.length > 0){
      var i;
      for(i=0;i<this._changes.length;i++){
        cookie += this._changes[i] + "=" + this.filterCookie(this._cookies[this._changes[i]]) +",";
        if(cookie.length > this._options.default_pack_length){
          cookie = cookie.substr(0,cookie.length - 1);
          cookie += extra;
          cookies.push(cookie);
          cookie = "c"+i+"=";
        }
      }
    }
    
    if(cookie){
      cookie = cookie.substr(0,cookie.length - 1);
      cookie += extra;
      cookies.push(cookie);
      cookie = "c"+i+"=";
    }
    
    header['Set-Cookie'] = cookies;
    return header;
  }
  
});
