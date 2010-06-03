Lnmm (Linux, Node, Memcache, Mysql)
===================================
Lnmm is a implementation of a webstack much like LAMP (Linux, apache, mysql, php)
However it replaces apache and php with node and javascript.

Todo:
-----------------------------------
Write a lnmm script that can install itself into the user's .node_libararies,
and can preloads the library path to a script executable. 

Installation and setup:
-----------------------------------
This install assumes that you have git, development tools, libmysqlclient-dev, 
and libmemcache-dev installed. If you are running ubuntu or debian, you can simply
do this: 
    # Install some dependencies
    sudo apt-get install libmysqlclient-dev libmemcache-dev build-essential git-core

After getting those dependencies, Pick a place to install into.
    # I keep my source files under ~/local/src
    cd ~/tmp

And make sure you have a recent version of node (0.1.97 at least).
    # Ensure a recent copy of node
    git clone http://github.com/ry/node.git
    cd node
    ./configure
    make
    sudo make install
    cd ..

Install the code
    # Grab the Lnmm source (if you have not already)
    git clone git@github.com:Nthalk/Lnmm.git
    cd Lnmm
    git submodule update --init
    # This should patch the dependencies and build them
    ./install
    ./run-tests --with-db-password="mypassword"
    
    
    

Dependencies & Credits:
-----------------------------------
Currently, Lnmm is built ontop of node 0.1.97 with the following modules required:
 * Sannis's libmysql client: http://github.com/Sannis/node-mysql-libmysqlclient
 * Vanillahsu's memcache client: http://github.com/vanillahsu/node-memcache
 * Underscore.js from documentcloud: http://github.com/documentcloud/underscore
 * Simple Javascript Inheritance from John Resig: http://ejohn.org/blog/simple-javascript-inheritance/

Notes:
-----------------------------------
Both Sannis's and Vanillahsu's libraries support async calling, but their protocol
implementations do not multiplex, so using two queries at once on the async
calls crash their clients.

I have created implementations of their client wrappers that implement a
callback-wrapped queue system that works rather well. I have sent them each the
code and I hope that they implement them soon. 

