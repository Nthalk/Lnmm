var Observable = require("../lib/Observable").Observable;

exports.Observable = function(test){
  test.expect(7);
  var o = new Observable();
  
  // Simple events
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
   o.fire("ev2",["only once!"]);
   
   // Function relaying
   var i = 0;
   var fn = function(){return "fn-" + (i++);};
   fn = o.relay("fn-spy",fn);
   o.on("fn-spy",function(data){
     test.ok(data==="fn-0");
   });
   fn();
   
   // Group scheduling
   o.when(["template","session","article"],function(template,session,article){
     test.ok(template[0] === "template");
     test.ok(session[0] === "session");
     test.ok(article[0] === "article");
     test.done();
   });
   setTimeout(o.relay("template",function(){return "template";}),20);
   setTimeout(o.relay("session",function(){return "session";}),20);
   setTimeout(o.relay("article",function(){return "article";}),20);
};