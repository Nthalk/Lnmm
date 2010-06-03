var Class = require("../Class");

exports.Request = Class.extend({
  // Private
  _req: null,
  
  // Public 
  url: null,
  
  // Constructor
  init: function(req){
    this._req = req;
    this.url = req.url;
  }
  
});