var Observable = require("../lib/Observable").Observable;


exports.Observable = function(test){
  test.expect(14);
  var o = new Observable();
  
  // Simple events
  o.on("ev1",function(data1,data2){
    test.ok(data1===1);
    test.ok(data2===2);
  });
  o.on("ev1",function(data1,data2){
    test.ok(data1===1);
    test.ok(data2===2);
  });
  
  o.fire("ev1",[1,2]);
  // More complicated
  o.once("ev2",function(data){
    test.ok(data==="only once!");
  });
  o.fire("ev2",["only once!"]);
  o.fire("ev2",["happend twice!"]);
   
  // Function relaying
  var i = 0;
  var fn = function(){return "fn-" + (i++);};
  fn = o.relay("fn-spy",fn);
  o.on("fn-spy",function(data){
    test.ok(data==="fn-0");
  });
  fn();
  
  // Chaining
  var sys = require("sys");
  o.chain(
    function(i){
      test.ok(i==1);
      return i+1;
    },
    function(i){
      test.ok(i==2);
      return i+1;
    },
    function(i){
      test.ok(i==3);
      return true;
    }
  )(1);
   
  // Group scheduling
  o.when(["article","session"],function(article,session){
    test.ok(article[0] === "article");
    test.ok(session[0] === "session");
  });
  
  o.when(["template","session","article"],function(template,session,article){
    test.ok(template[0] === "template");
    test.ok(session[0] === "session");
    test.ok(article[0] === "article");
    test.done();
  });
  
  
   
  setTimeout(o.relay("template",function(){
    return "template";}),25);
  setTimeout(o.relay("session",function(){
    return "session";}),10);
  setTimeout(o.relay("article",function(){
    return "article";}),11);
};