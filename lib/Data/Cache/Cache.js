var Class = require("../../Class");

exports.Cache = Class.extend({
  init: function(options){},
  connect: function(callback){throw new Error("unimplemented");},
  get: function(key,callback){throw new Error("unimplemented");},
  set: function(key,value,callback,expiration){throw new Error("unimplemented");},
  incr: function(key,value,callback){throw new Error("unimplemented");},
  decr: function(key,value,callback){throw new Error("unimplemented");}
});
