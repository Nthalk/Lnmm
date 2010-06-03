var Result = require("../Result").Result;

exports.Result = Result.extend({
  _result: null,
  _last_insert_id: null,
  _affected_rows: null,
  init: function(result, last_insert_id, affected_rows){
      if(result instanceof Error){
          throw result;
      }
      this._result = result; 
      this._last_insert_id = last_insert_id;
      this._affected_rows = affected_rows;
  },
  getCount: function(){return this._result.numRows();},
  getLastInsertId: function(){return this._last_insert_id;},
  getAffectedRows: function(){return this._affected_rows;},
  getField: function(offset){return this._result.fetchFieldDirect(offset?offset:0);},
  getObject: function(){return this._result.fetchObject();},
  getArray: function(){return this._result.fetchArray();},
  getArrays: function(){return this._result.fetchArrays();},
  free: function(){return this._result.free();}
});
