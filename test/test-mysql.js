var MySQL = require("../lib/Data/Base/MySQL/Server").Server;
var mysql1 = new MySQL({pass:"m8db"});
var mysql2 = new MySQL({pass:"m8db"});

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

