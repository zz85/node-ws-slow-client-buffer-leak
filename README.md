## Node Ws Slow Client Buffer Leak

When my colleagues and I at [Zopim](https://zopim.com) did a series of load tests on our NodeJS servers,
we observed the "Slow Clients" behaviour.

The slow clients problem meant that when servers send data faster than clients can receive, the data has to be buffered somewhere.
In our case the data was kept in queued at NodeJS socket layer (not flushed to the OS) leading to an increase of Node's RSS usage (in buffers outside V8 heap).

One common solution is the "slow client" problem is to use a reverse proxy, or avoid sending overwhelmed clients by back-pressuring using streams/drain/pause/resume. 

However the problem here is when the clients disconnected, a sizable amount of memory didn't seem to be freed leading to a seemingly increasing memory usage by Node.

The test scripts here demostrate the issue. To test this, you should run the server and clients on separate machines to introduce network latency and buffering.

I typically test with 200 clients for about 30 seconds.

This issue was intially reported [on the ws repository](https://github.com/websockets/ws/issues/667) followed by [an issue on nodejs](https://github.com/nodejs/node/issues/4779).

There is currently [a fix for the nodejs HTTP Parser Pool leak](https://github.com/nodejs/node/pull/4773) by @Nibbler999.

Before killing clients.
![image](https://cloud.githubusercontent.com/assets/314997/12353695/02a51920-bbcc-11e5-8a9d-daefa5da038f.png)

After killing clients at 30s (200MB of RSS not cleanup here).
![image](https://cloud.githubusercontent.com/assets/314997/12353706/15d5ac3a-bbcc-11e5-911d-4cdc7bc38e21.png)

### Usage

#### Requirements
- Node 4
- run `npm install`

#### HTTP

HTTP Server
```
node --expose_gc httpserver.js
```

HTTP Client
```
node wsclient target:port 200
```

#### WS

WebSocket Server
```
node --expose_gc wsserver.js
```

WebSocket Client
```
node wsclient target:port 200
```

#### TCP

TCP Server
```
node --expose_gc wsserver.js
```

TCP Client
```
node wsclient ws://target:port 200
```
