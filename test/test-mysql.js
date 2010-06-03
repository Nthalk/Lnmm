var MySQL = require("../lib/Data/Base/MySQL/Server").Server;
var mysql1 = new MySQL({pass:"m8db"});
var mysql2 = new MySQL({pass:"m8db"});

exports.MySQLStress = function(test){
  var q;
  for(i = 0; i < 10000; i++){
    if(i%2===1){
      q = mysql1;
    }else{
      q = mysql2;
    }
    var v = i%500;
    test.expect(10000);
    q.query("select ?;",[v],(function(t){return function(value){test.ok(t=value);};})(v));
  }
  var i = 0;
  mysql1.query("select ?;",[v],function(){
    i++;
    if(i == 2){
      test.done();
    }
  });
  mysql2.query("select ?;",[v],function(){
    i++;
    if(i == 2){
      test.done();
    }
  });
};

