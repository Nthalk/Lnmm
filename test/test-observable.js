var Observable = require("./lib/Observable").Observable;

var o = new Observable();
var fn = function(data){sys.log("test: " + data);};
o.on("test",fn);
o.fire("test",["1/2"]);
o.fire("test",["2/2"]);
o.un("test",fn);
o.fire("test",["Should not fire"]);

var fn1 = function(){
  return "1/1";
};
fn1 = o.relay("ev1",fn1);
o.on("ev1",function(data){sys.log("relay: " + data);});
fn1();

o.when(["ev1","test"],function(ev1,test){
  sys.log("test: " + test[0]);
  sys.log("ev1: " + ev1[0]);
});

fn1();
o.fire("test",["when - test"]);
