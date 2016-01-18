var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 3000 });
  
var chart = require('chart');
var clear = require('clear');
var fake = require('./fake');

var FAKE = fake(512 * 1024);

var sockets = new Set()

wss.on('connection', function connection(ws) {
    sockets.add(ws);
    console.log('SOCKET', 'Connection')
    
    var clearme;
    ws.on('close', function close() {
        console.log('SOCKET', 'disconnected');
        sockets.delete(ws);
        clearTimeout(clearme);
        ws = null
    });

    clearme = setTimeout(fake_update, 0);

    var start = Date.now(); 

    // setTimeout( function destroySocket() {
    //     console.log('SOCKET', 'DESTROY')
    //     ws.close()
    //     ws = null
    // }, 0.5 * 1000 * 60);

    function fake_update() {
        var fake_data = FAKE + fake(4);
        if (ws) ws.send(fake_data);

        var timeout = 2000;

        if (Date.now() - start > 60 * 1.5 * 1000) {
            console.log('SOCKET stop sending')
        } else {
            clearme = setTimeout(fake_update, timeout);    
        }
    }
    
});

var data = [];

var time = Date.now()

setInterval(function() {
    gc(); gc();
    clear();
    console.log(chart(data, { width: 120, height: 40 }));
    console.log('Sockets', sockets.size);
    var mem = process.memoryUsage();
    data.push(mem.rss / 1024 / 1024)
    console.log('RSS', (mem.rss / 1024 / 1024).toFixed(2), 'MB' )
    console.log('HeapTotal', (mem.heapTotal / 1024 / 1024).toFixed(2), 'MB' )
    console.log('HeapUsed', (mem.heapUsed / 1024 / 1024).toFixed(2), 'MB' )
    console.log( ((Date.now() - time) / 1000).toFixed(2), 's') 
}, 2000)