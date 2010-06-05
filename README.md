Lnmm (Linux, Node, Memcache, Mysql)
===================================
Lnmm is a implementation of a webstack much like LAMP (Linux, apache, mysql, php)
However it replaces apache and php with node and javascript.

Installation and setup:
-----------------------------------
This install assumes that you have git, development tools, libmysqlclient-dev, 
and libmemcache-dev installed. If you are running ubuntu or debian, you can simply
do this: 
    # Install some dependencies
    sudo apt-get install libmysqlclient-dev libmemcache-dev build-essential git-core

After getting those dependencies, Pick a place to install into.
    # I keep my source files under ~/local/src
    mkdir ~/tmp
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
    ./run-tests --mysql-pass="mypassword"
    

Basic comparison Between LNMM and LAMP
-----------------------------------
Check the comparison directory for a simple script that uses some of the php
library, accesses memcache a few times, and hits mysql.

How is the speed difference?
LMNN - 
    $ ab -n10000 -c100 localhost:8080/
    Server Software:                
    Server Hostname:        localhost
    Server Port:            8080

    Document Path:          /
    Document Length:        26 bytes

    Concurrency Level:      100
    Time taken for tests:   4.012 seconds
    Complete requests:      10000
    Failed requests:        0
    Write errors:           0
    Total transferred:      1390000 bytes
    HTML transferred:       260000 bytes
    Requests per second:    2492.25 [#/sec] (mean)
    Time per request:       40.124 [ms] (mean)
    Time per request:       0.401 [ms] (mean, across all concurrent requests)
    Transfer rate:          338.30 [Kbytes/sec] received

    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.9      0      12
    Processing:    12   40   8.3     37      70
    Waiting:       12   40   8.3     37      70
    Total:         19   40   8.3     37      70

    Percentage of the requests served within a certain time (ms)
      50%     37
      66%     39
      75%     42
      80%     45
      90%     54
      95%     57
      98%     64
      99%     67
     100%     70 (longest request)

LAMP -
    Server Software:        Apache/2.2.14
    Server Hostname:        localhost
    Server Port:            80

    Document Path:          /index.phtml
    Document Length:        25 bytes

    Concurrency Level:      100
    Time taken for tests:   5.136 seconds
    Complete requests:      10000
    Failed requests:        0
    Write errors:           0
    Total transferred:      2870010 bytes
    HTML transferred:       250875 bytes
    Requests per second:    1947.06 [#/sec] (mean)
    Time per request:       51.359 [ms] (mean)
    Time per request:       0.514 [ms] (mean, across all concurrent requests)
    Transfer rate:          545.71 [Kbytes/sec] received

    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    6   4.6      5      28
    Processing:     7   44   6.4     44      98
    Waiting:        2   42   7.0     43      92
    Total:         11   51   5.4     50     109

    Percentage of the requests served within a certain time (ms)
      50%     50
      66%     51
      75%     51
      80%     52
      90%     57
      95%     59
      98%     64
      99%     71
     100%    109 (longest request)


LAMP Requests per second:    1947.06 [#/sec] (mean)
LNMM Requests per second:    2492.25 [#/sec] (mean)

During testing, I found that performance is very dependent on implementation. If 
I loaded the template file each request, PHP would have won by the same margin.

Even so, that is pretty efficient PHP, no includes, simple setup, no classes, 
one could easily improve that code (I wrote it in 10 minutes), but I doubt it 
would be very much faster.

In conclusion, LNMM is a very young project, and it will still be some time
before anything gets majorly optimized (I know that the Memcache c module needs
a good speedup from some micro benchmarks (It's slower than the mysql binding!)),
however LNMM is a much faster (27% in this example) stack than LAMP if you do as 
much preexecution and preloading as possible.

Dependencies & Credits:
-----------------------------------
Currently, Lnmm is built ontop of node 0.1.97 with the following modules required:
 - Sannis's libmysql client: http://github.com/Sannis/node-mysql-libmysqlclient
 - Vanillahsu's memcache client: http://github.com/vanillahsu/node-memcache
 - Underscore.js from documentcloud: http://github.com/documentcloud/underscore
 - Simple Javascript Inheritance from John Resig: http://ejohn.org/blog/simple-javascript-inheritance/
 - Waveto's node-crypto: http://github.com/waveto/node-crypto

Notes:
-----------------------------------
Both Sannis's and Vanillahsu's libraries support async calling, but their protocol
implementations do not multiplex, so using two queries at once on the async
calls crash their clients.

I have created implementations of their client wrappers that implement a
callback-wrapped queue system that works rather well. I have sent them each the
code and I hope that they implement them soon. 

