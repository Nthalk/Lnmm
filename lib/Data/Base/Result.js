var Class = require("../../Class"); 

exports.Result = Class.extend({
    getCount: function(){throw new Error("Unimplemented.");},
    getLastInsertId: function(){throw new Error("Unimplemented.");},
    getAffectedRows: function(){throw new Error("Unimplemented.");},
    getField: function(offset){throw new Error("Unimplemented.");},
    getObject: function(){throw new Error("Unimplemented.");},
    getArray: function(){throw new Error("Unimplemented.");},
    getArrays: function(){throw new Error("Unimplemented.");},
    free: function(){throw new Error("Unimplemented.");}
});