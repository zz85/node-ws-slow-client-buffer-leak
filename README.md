## Node Ws Slow Client Buffer Leak

This is used to illustrate the effects of node's RSS memory when connected with slow clients and whether they gets reclaimed after clients disconnect.

Also see [initial report here](https://github.com/websockets/ws/issues/667) 

### Usage

#### Requirements
- Node 4
- run `npm install`

#### WS

Server
```
node --expose_gc wsserver.js
```

Client
```
node wsclient target:port 200
```

#### TCP

Server
```
node --expose_gc wsserver.js
```

Client
```
node wsclient ws://target:port 200
```
