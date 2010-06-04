var sys = require("sys");
exports.safely = function(fn){
  return function(){try{
    return fn.apply(this,arguments);
  }catch(e){
    sys.log("SAFE ERROR - " + e.message + "\n" + e.stack.toString());
  }};
};