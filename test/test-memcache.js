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
  var i = 0;
  for(i = 0; i < 100; i++){(function(i){
    var key = "memcache-test-"+i;
    mem.set(key,i,function(){
      mem.get(key,function(v){
        mem.set(key,v^2,function(q){
          sys.log(sys.inspect(arguments));
        });
      });
    });
  })(i);}
  test.expect(101);
};
