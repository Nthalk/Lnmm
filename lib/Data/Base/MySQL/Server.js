var Server = require("../Server").Server;
var MysqlConn = require("../../../../deps/node-mysql/mysql_bindings").MysqlConn;
var MySQLResult = require("./Result").Result;
var sys = require("sys");

var options = {
  host: "localhost",
  user: "root",
  pass: "",
  port: "3306",
  database: ""
};



exports.Server = Server.extend({
  _connection : null,
  _query_queue : null,
  _is_running : false,
  last_query : "",
  
  init : function(options) {
    if(!options){
      options = exports.Server.options;
    }else{
      var n;
      for(n in exports.Server.options){
        if(typeof options[n] === 'undefined'){
          options[n] = exports.Server.options[n];
        }
      }
    }    
    // Setup variables
    this._queue = [];
    this._connection = new MysqlConn();
    
    // Connect to the server
    if(!this._connection.connect(
      options.host,
      options.user,
      options.pass,
      options.database,
      options.port
    )){
      throw new Error("Could not connect to the mysql server: " + options.host + "("+options.port+") with username " + options.user + (options.pass?" using a password":" without a password"));
    }
    
  },
  
  query : function(query, replacements, row_callback, query_callback) {
    // Loop through the query looking for ? marks.
    if (replacements && replacements.length > 0) {
      var i;
      var last_pos = -1;
      var replacement;
      for (i = 0; i < replacements.length; i++) {
        last_pos = query.indexOf(
          "?",
          last_pos + 1);
        if (last_pos === -1) {
          throw new Error(
            "Invalid query replacement index. Queries need to have replacement tokens '?' for each replacement."
          );
        }
        replacement = replacements[i] + "";
        if (!replacement.match(/\d+\.?\d*/)) {
          // Add slashes to slashes and quotes and encase in quotes
          replacement = "'" + replacement.replace(
            /[\\"']/g,
            '\\$&').replace(
            /\u0000/g,
            '\\0') + "'";
        }
        query = query.substr( 0, last_pos ) + replacement + query.substr(last_pos + 1);
        last_pos += replacement.length;
      }
    };
    
    this._doQueue([query+";",row_callback,query_callback]);
  },
  
  _doQueue: function(args){
    if (this._is_running) {
      this._queue.push(args);
    } else {
      this._is_running = true;
      return this._do(args);
    }
  },
  _doGetFn: function(row_callback,query_callback){
    var self = this;
    return function(result){
    // Is it an error?
    if(result instanceof Error){
      throw new Error(self._connection.error() + " during " + self.last_query);
    }
    // Do we have a row callback?
    if (row_callback) {
      var row;
      while (row = result.fetchObject()) {
        if (row_callback(row) === false) {
          break;
        }
      }
    }
    // Do we have a query callback?
    if (query_callback) {
      var affected_rows = 0;
      try {
        affected_rows = self._connection.affectedRows();
      } catch (e) {};
      var res = new MySQLResult(
        result,
        self._connection.lastInsertId(),
        affected_rows
      );
      query_callback(res);
    }
    // Free that result
    result.free();
    var queued = self._queue.shift();
    if(queued){
      self._do(queued);
    }else{
      self._is_running = false;
    }
  };},
  
  _do: function(args){
    this.last_query = args[0];
    return this._connection.queryAsync(
      args[0],
      this._doGetFn(
        args[1],
        args[2]
      )
    );
  },
  
  queryTable : function(table, where, replacements, row_callback,
      query_callback) {
    var query = "select * from " + table + " where " + where;
    return this.query(
      query,
      replacements,
      row_callback,
      query_callback);
  }
  
});

exports.Server.options = options;
