var Class = require("./Class");

exports.Application = Class.extend({
  init: function(){
    require("sys").puts("yay");
  }
});