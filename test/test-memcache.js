var Memcache = require("../lib/Data/Cache/Memcache").Memcache;
var mem = new Memcache();
mem.connect();
sys.log("Memcache: Setting up 10k Requests. Set/Get");
var i = 0;
for(i = 0; i < 5000; i++){
  mem.set(i,i,function(value){});
  mem.get(i,function(value){});
}
sys.log("Memcache: finished queueing.");
sys.log("Memcache: queuing final action.");
mem.get(400,function(value){
  sys.log("Memcache: final value: " + value);
});
