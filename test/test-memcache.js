var Memcache = require("../lib/Data/Cache/Memcache").Memcache;
var mem = new Memcache();

exports.Memcache = function(test){
  mem.connect();
  test.expect(1);
  mem.set("connect-test",1,function(value){});
  mem.get("connect-test",function(value){
    test.ok(value);
    test.done();
  });
};

exports.MemcacheStress = function(test){
  var i = 0;
  for(i = 0; i < 5000; i++){
    mem.set(i,i,function(value){});
    mem.get(i,function(value){});
  }
  test.expect(1);
  mem.get(400,function(value){
    test.ok(400);
    test.done();
  });
};
