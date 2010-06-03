Lnmm (Linux, Node, Memcache, Mysql)
===================================
Lnmm is a implementation of a webstack much like LAMP (Linux, apache, mysql, php)
However it replaces apache and php with node and javascript.

Todo
-----------------------------------
Write a lnmm script that can install itself into the user's .node_libararies,
and can preloads the library path to a script executable. 

Installation and setup
-----------------------------------
Currently there is no installation other than making sure that you have the
dependencies (and their dependencies) installed in the correct places.

Dependencies & Credits
-----------------------------------
Currently, Lnmm is built ontop of node 0.1.97 with the following modules required:

Sannis's libmysql client: http://github.com/Sannis/node-mysql-libmysqlclient
Elbart's memcache client: http://github.com/elbart/node-memcache
Underscore.js from documentcloud: http://github.com/documentcloud/underscore
Simple Javascript Inheritance from John Resig: http://ejohn.org/blog/simple-javascript-inheritance/

Notes
-----------------------------------
Both Sannis's and Elbart's libraries support async calling, but their protocol
implementations do not multiplex, so using two queries at once on the async
calls crash their clients.

I have created implementations of their client wrappers that implement a
callback-wrapped queue system that works rather well. I have sent them each the
code and I hope that they implement them soon. 

