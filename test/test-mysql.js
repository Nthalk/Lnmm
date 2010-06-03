var MySQL = require("../lib/Data/Base/MySQL/Server").Server;
var options = {};
process.argv.forEach(function (val, index, array) {
  if(val.match("--mysql-pass=")){
    options.pass = val.split('=',2)[1];
  }
  if(val.match("--mysql-user=")){
    options.user = val.split('=',2)[1];
  }
});
var mysql1;
var mysql2;

exports.MySQLConnect = function(test){
  test.expect(1);
  try{
    mysql1 = new MySQL(options);
    mysql2 = new MySQL(options);
    test.ok(1);
  }catch(e){
    throw new Error("could not connect to mysql server, try running with --mysql-pass=YOUR_DB_PASSWORD or --mysql-user=YOUR_DB_USER");
  }
  test.done();
};

exports.MySQLStress = function(test){
  var total = 200;
  var q;
  for(i = 0; i < total; i++){
    if(i%2===1){
      q = mysql1;
    }else{
      q = mysql2;
    }
    test.expect(total);
    q.query("select ?;",[i],(function(t){return function(value){test.ok(t=value);};})(i));
  }
  var done = 0;
  mysql1.query("select ?;",[i],function(){
    done++;
    if(done == 2){
      test.done();
    }
  });
  mysql2.query("select ?;",[i],function(){
    done++;
    if(done == 2){
      test.done();
    }
  });
};

