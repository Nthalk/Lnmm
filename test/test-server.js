var Server = require("../lib/Web/Server").Server;
var http = require("http");
var sys = require("sys");

var port = 23148;
var s = new Server({port:port,log:false});

exports.Start = function(test){
  test.expect(1);
  s.start();
  test.ok(1);
  test.done();
};

exports.ConnectAndNotFound = function(test){
  test.expect(1);
  var client = http.createClient(port,"localhost");
  var request = client.request("/");
  request.addListener("response",function(response){
    response.addListener('data',function(data){
      test.ok(data=="404 not found.");
      test.done();
    });
  });
  request.end();
};

exports.Route = function(test){
  test.expect(1);
  s.route("/test",function(req,resp){
    resp.header(200);
    resp.end("test");
  });
  var client = http.createClient(port,"localhost");
  var request = client.request("/test");
  request.addListener("response",function(response){
    response.addListener('data',function(data){
      test.ok(data=="test");
      test.done();
    });
  });
  request.end();
};

exports.Shutdown = function(test){
  test.expect(1);
  s.stop();
  test.ok(1);
  test.done();
};