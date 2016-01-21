var http = require('http');

var chart = require('chart');
var clear = require('clear');
var fake = require('./fake');

var FAKE = fake(512 * 1024);

var sockets = new Set()

var port = 54321;

http.createServer(handleRequest).listen(port);

function handleRequest(request, response) {
    sockets.add(response);

    var clearme;
    request.on('close', function close() {
        console.log('disconnected');
        sockets.delete(response);
        clearTimeout(clearme);
        response = null
    });

    clearme = setTimeout(fake_update, 0);

    var start = Date.now();
    
    response.writeHead(200, {});
    
    // setTimeout( function destroySocket() {
    //     console.log('DESTROY')
    //     response.end()
    //     response = null
    // }, 0.5 * 1000 * 60);

    function fake_update() {
        var fake_data = FAKE + fake(4);
        if (response) response.write(fake_data);

        var timeout = 2000;

        if (Date.now() - start > 60 * 1.5 * 1000) {
            console.log('stop sending')
        } else {
            clearme = setTimeout(fake_update, timeout);
        }
    }

};

var data = [];

var time = Date.now()

setInterval(function() {
    if (global.gc) { gc(); gc(); }
    clear();
    console.log(chart(data, { width: 120, height: 40 }));
    console.log('Sockets', sockets.size);
    var mem = process.memoryUsage();
    data.push(mem.rss / 1024 / 1024)
    console.log('RSS', (mem.rss / 1024 / 1024).toFixed(2), 'MB' )
    console.log('HeapTotal', (mem.heapTotal / 1024 / 1024).toFixed(2), 'MB' )
    console.log('HeapUsed', (mem.heapUsed / 1024 / 1024).toFixed(2), 'MB' )
    console.log( ((Date.now() - time) / 1000).toFixed(2), 's');

    var socketBufferSize = 0;
    sockets.forEach( s => {
        socketBufferSize += s.bufferSize;
    });

    console.log('Socket Buffer Size', (socketBufferSize / 1024 / 1024).toFixed(2), 'MB' )
}, 2000)
