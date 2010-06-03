var Memcache = require("../lib/Data/Cache/Memcache").Memcache;
var mem = new Memcache();

exports.Memcache = function(test){
  mem.connect();
  test.expect(1);
  mem.set("connect-test",1,function(value){});
  mem.get("connect-test",function(value){
    test.ok(value == 1);
    test.done();
  });
};
var sys = require("sys");
exports.MemcacheStress = function(test){
  var key = "memcache-test";
  mem.set(key,1,function(){
    mem.get(key,function(v){
      mem.set(key,1+parseInt(v),function(){
        mem.get(key,function(i){
          test.ok(i==2);
          test.done();
        });
      });
    });
  });
};
