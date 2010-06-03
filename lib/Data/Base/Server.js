var Class = require("../../Class");

exports.Server = Class.extend({
    init: function(options,callback){throw new Error("Unimplemented.");},
    query: function(query,replacements,row_callback,query_callback){throw new Error("Unimplemented.");},
    queryTable: function(table,where,replacements, row_callback,query_callback){throw new Error("Unimplemented.");},
    disconnect: function(){throw new Error("Unimplemented.");}
});