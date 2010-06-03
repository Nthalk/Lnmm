
/**
 * Exports:
 * 
 *  .extend(prop)
 *  Creates a new class off of the base class Class.
 *  Other classes can be extended from them by using the Child.extend({}) function.
 */

var initializing = false;
var fnTest = /\b_super\b/;

/**
 * This is the base class that everything extends from
 */
Class = function(){};

/**
 * This function extends the current object into a new one with the property
 * modifications. Existing functions are still accessable through _super().
 * 
 * @param object prop The class body.
 * @return function the class constructor
 */
Class.prototype.extend = function(prop) {
  initializing = true;
  var _super = new (this.constructor)();
  initializing = false;
  init = false;
  
  var n;
  for(n in _super){
    if(typeof prop[n] === typeof _super[n] === "function"){
      if(/\b_super\b/.test(prop[n])){
        prop[n] = (function(n){return function(){
          var tmp = this._super;
          this._super = _super[n];
          var ret = this[n].apply(this,arguments);
          this._super = tmp;
          return ret;
        };})();
      }
    }else if(typeof prop[n] === "undefined"){
      prop[n] = _super[n];
    }
  }
    
  var ret = function(){
    if(!initializing && this.init){
      this.init.apply(this,arguments);
    }
  };
  
  ret.prototype = prop;
  ret.constructor = ret;
  ret.extend = ret.prototype.extend;
  return ret;
};


var instance = new Class();
exports.extend = function(){
  return instance.extend.apply(instance,arguments);
};
