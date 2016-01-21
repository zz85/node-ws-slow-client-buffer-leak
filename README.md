## Node Ws Slow Client Buffer Leak

This is to illustrate the effects of nodejs's RSS memory when connected with slow clients and whether memory gets reclaimed after clients disconnect.

To test this, you should run the server and clients on separate machines to introduce network latency and buffering. RSS will increase running simply with 200 clients for about 30 seconds. When clients are disconnected, the RSS does not fully recovers.

One common solution for slow clients is to use a reverse proxy, or to back-pressure using streams/drain/pause/resume. What I'm hoping to find out here though is whether the increasing RSS is a known behaviour or a leak.

This issue was intially reported [on the ws repository](https://github.com/websockets/ws/issues/667) followed by [an issue on nodejs](https://github.com/nodejs/node/issues/4779).

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
