sys.log("Mysql: Setting up 10k queries across 2 database connections");
var mysql = new (require("../lib/Data/Base/MySQL/Server").Server)({pass:"m8db"});
var mysql2 = new (require("../lib/Data/Base/MySQL/Server").Server)({pass:"m8db"});
var q;
for(i = 0; i < 10000; i++){
  if(i%2===1){
    q = mysql;
  }else{
    q = mysql2;
  }
  q.query("select * from ocid.countries limit ?,1;",[i%500],function(value){});
}
sys.log("Mysql: finished queueing.");
q.query("select * from ocid.countries limit 1;",null,function(value){
  sys.log("Mysql: final value: " + value.id);
});
