var Cache = require("./Cache").Cache;
var Memcache = require('../../../deps/node-memcache/build/default/memcache-impl');

/**
 * Default Variables
 */
var options = {
  host: "localhost",
  port: 11211,
  expiration: 0,
  callback: function(){}
};


/**
 * The main export
 */
exports.Memcache = Cache.extend({
  /**
   * Member variables
   */
  _options: null,
  _conn : null,
  _queue: null,
  
  /**
   * Constructor
   */
  init: function(options){
    if(!options){
      options = exports.Memcache.options;
    }else{
      var n;
      for(n in exports.Memcache.options){
        if(typeof options[n] === 'undefined'){
          options[n] = exports.Memcache.options[n];
        }
      }
    }
    
    this._options = options;
    this._conn = new Memcache.Connection();
    this._queue = [];
  },
  
  connect: function(callback){
    this.addServer(
      this._options.host,
      this._options.port 
    );
    if(callback){
      setTimeout(callback,1);
    }
  },
  
  addServer: function(server,port){
    return this._conn.addServer(server,port);
  },
  
  /**
   * Enqueues an action (must be supported by _do) to start the running, or
   * to be run later.
   */
  _doQueue: function(){
    if (this._is_running) {
      this._queue.push(arguments);
    } else {
      this._is_running = true;
      this._do(arguments);
    }
  },
  
  /**
   * Wraps a callback in a queue puller that will set _is_running to false when
   * done.
   */
  _doGetFn: function(callback){
    var scope = this;
    return function(){
      var queued = scope._queue.shift();
      if(queued){
        scope._do(queued);
      }else{
        scope._is_running = false;
      }
      if(callback){
        // Seriously, why is error returned first? Let's fix that.
        callback.apply(scope,[arguments[1],arguments[0]]);
      }
    };
  },
  
  /**
   * We need to wrap the callback into a queue puller that starts the next action
   * before running the callback. Additionally, if there is no callback, must
   * supply a puller. This should only be called by _doQueue and _doGetFn
   */
  _do: function(args){
    var fn = Array.prototype.shift.call(args);
    var cbi = args.length-1; // The callback index
    if(typeof args[cbi] === "function"){
      args[cbi] = this._doGetFn(args[cbi]); // wrap that puppy in the queue puller
    }else{
      args[args.length] = this._doGetFn(false); // Create a new one (this may break if given bad arguments).
    }
    this._conn[fn].apply(this._conn,args);
  },
  
  get: function(key,callback){
    return this._doQueue("get",key+"",callback ? callback : this._options.callback);
  },
  
  set: function(key,value,callback,expiration){
    return this._doQueue(
      "set",
      Memcache.MEMC_SET,
      key + "",
      value + "",
      typeof expiration !== "undefined" ? expiration : this._options.expiration,
      callback ? callback : default_callback
    );
  },
  
  incr: function(key,value,callback){
    return this._doQueue(
      "set",
      Memcache.MEMC_INCR,
      key + "",
      value + "",
      callback?callback:this._options.callback
    );
  },
  decr: function(key,value,callback){
    return this._doQueue(
      "set",
      Memcache.MEMC_DECR,
      key + "",
      value + "",
      callback?callback:this._options.callback
    );
  }
});

exports.Memcache.options = options;
