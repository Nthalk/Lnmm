var Class = require("../Class");
var Cookies = require("./Cookies").Cookies;
var Cache = require("../Data/Cache/Cache").Cache;
var url = require("url");
var sys = require("sys");
var crypt = require("crypto");

var options = {
  cookie_options: false,
  session_cache: new Cache(),
  session_key: 'ses'
};

exports.Request = Class.extend({
  // Private
  _req: null,
  _cookies: null,
  _session: null,
  _url: null,
  _post: null,
  
  // Public 
  url: null,
  headers: null,
  
  // Constructor
  init: function(req){
    this._req = req;
    this.url = req.url;
    this.headers = req.headers;
  },
  
  applyCookies: function(headers){
    return this.getCookies().applyHeaders(headers);
  },
  
  getCookies: function(){
    if(!this._cookies){
      this._cookies = new Cookies(this._req,exports.Request.options.cookie_options);
    }
    return this._cookies;
  },
  
  setCookie: function(key,value){
    this.getCookies().set(key,value);
  },
  
  getCookie: function(key,if_null){
    return this.getCookies().get(key,if_null);
  },
  
  getSessionKey: function(){
    if(!this._session){
      this._session = this.getCookie(exports.Request.options.session_key,false);
      if(!this._session){
        this._session = this.generateSessionKey();
        this.setCookie(exports.Request.options.session_key,this._session);
      }
    }
    return this._session;
  },
  
  generateSessionKey: function(){
    return 
      (new crypto.Hash).init("md5").update((new Date().getMilliseconds()) + sys.inspect(this._req)).digest("base64")
    ;
  },
  
  setSession: function(key,value,cb){
    return exports.Request.options.session_cache.set(this.getSessionKey() + "-" + key,value,cb);
  },
  
  getSession: function(key,cb){
    return exports.Request.options.session_cache.get(this.getSessionKey() + "-" + key,cb);
  },
  
  getGet: function(key,ifnull){
    if(!this._url){
      this._url = url.parse(this.url,true);
    }
    if(this._url.query && typeof this._url.query[key] !== 'undefined'){
      return this._url.query[key];
    }else{
      return ifnull;
    }
  },
  
  getPost: function(key,ifnull){
    if(!this._post){
      this._post = url.parse(this._req.headers.post,true);
    }
    if(this._post.query && typeof this._post.query[key] !== 'undefined'){
      return this._post.query[key];
    }else{
      return ifnull;
    }
  }
  
});

exports.Request.options = options;