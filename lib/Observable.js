var Class = require("./Class");
/**
 * A basic class for observing, firing, and scheduling events.
 * Usage:
 * 
 * var o = new Observable();
 * 
 * // Simple events
 * o.on("ev1",function(data1,data2){sys.log(data1 + ":" + data2)});
 * o.fire("ev1",[1,2]);
 * 
 * // More complicated
 * o.once("ev2",function(data){sys.log(data);});
 * o.fire("ev2","only once!");
 * o.fire("ev2","only once!");
 * 
 * // Function relaying
 * var fn = function(){return "fn";};
 * fn = o.relay("fn-spy",fn);
 * o.on("fn-spy",function(data){sys.log(data);});
 * 
 * // Group scheduling
 * o.when(["template","session","article"],function(template,session,article){
 *  // Once we get the template, session, and article, run this.
 *  sys.puts(template[0].render({session:session[0],article:article[0]}));
 * });
 * fs.readFile("./tpl.tpl",o.relay("template"));
 * mem.get("session-key",o.relay("session"));
 * db.query("select * from articles where id = ? limit 1",123,o.relay("article");
 * 
 */
exports.Observable = Class.extend({
  _events: null,
  
  init: function(){
    this._events = {}; 
  },
  
  /**
   * Fires an event with the arguments provided
   */
  fire: function (ev, args){
    if(this._events[ev]){
      var i;
      var removal_detected = false;
      for(i=0;i<this._events[ev].length;i++){
        if(this._events[ev][i]!==-1){
          try{
            this._events[ev][i].apply(null,args);
          }catch(e){
            if(ev!=="error"){
              this.fire('error', [e]);
            }
          }
        }else{
          removal_detected = true;
        }
      }
      if(removal_detected){
        while((i=this._events[ev].indexOf(-1)) !== -1){
          this._events[ev].splice(i,1);
        }
      }
    }else if(ev === "error"){
      throw new Error(e);
    }
  },
  
  chain: function(cb1,cb2){
    var i; // Work backwards
    for( i = arguments.length - 1; i > 0 ; i --){
      // Set the previous callback to pass args to this callback
      arguments[i-1] = (function(previous,next){
        return function(){
          return next.call(null,previous.apply(null,arguments));
        };
      })(arguments[i-1],arguments[i]);
    }
    return arguments[0];
  },
  
  /**
   * Returns a delegate by binding a function to a scope so that it will be 
   * invoked as if calling scope.fn(...)
   */
  bind: function(fn,scope){
    return function(){fn.apply(scope,arguments);};
  },
  
  /**
   * Relays a spy function that sends the results when called to this object's
   * event ev. If no function was provided, a simple passthrough is created.
   */
  relay: function(ev,fn){
    var self = this;
    if(fn){
      return function(){
        self.fire(ev,[fn.apply(null,arguments)]);
      };
    }else{
      return function(){
        self.fire(ev,arguments);
      };
    }
  },
  
  /**
   * When called, it listens for all of the events to be completed and then
   * fires the final callback with each result set being added to the arguments.  
   */
  when: function(evs,cb){
    var count = evs.length;
    var tmp = {};
    var i;
    for(i=0;i<count;i++){
      this.once(evs[i],(function(ev){return function(){
        tmp[ev] = arguments;
        count--;
        if(count === 0){
          var args = [];
          var i;
          for(i=0;i<evs.length;i++){
            args.push(tmp[evs[i]]);
          }
          cb.apply(null,args);
        }
      };})(evs[i]));
    }
  },
  
  /**
   * Binds a callback to an event, upon firing that event, 
   * the callback is unbound.
   */
  once: function(ev,cb){
    var self = this;
    var cb2 = function(){
      self.un(ev,cb2);
      return cb.apply(null,arguments);
    };
    this.on(ev,cb2);
  },
  
  /**
   * Removes a bound callback from an event
   */
  un: function(ev,cb){
    if(this._events[ev]){
      var i = this._events[ev].indexOf(cb);
      if(i !== -1){
        this._events[ev][i] = -1;
      }
    }
  },
  
  /**
   * Binds a callback to an event
   */
  on: function(ev,cb){
    if(!this._events[ev]){
      this._events[ev] = [cb];
    }else{
      this._events[ev].push(cb);
    }
  }
  
}); 
