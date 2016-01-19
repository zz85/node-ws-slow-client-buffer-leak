var net = require('net');

var chart = require('chart');
var clear = require('clear');
var fake = require('./fake');

var FAKE = fake(512 * 1024);

var sockets = new Set()

var server = net.createServer(function(socket) {
    sockets.add(socket);
    console.log('Connection')

    // socket.on('message', function incoming(message) {
    // console.log('received: %s', message);
    // });

    var clearme;

    function done() {
        sockets.delete(socket);
        clearTimeout(clearme);
        socket = null
    }

    socket.on('error', function close() {
        console.log('Error');
        done();
    });


    socket.on('close', function close() {
        console.log('Close');
        done();
    });

    clearme = setTimeout(fake_update, 0);

    var start = Date.now();

    // setTimeout( function destroySocket() {
    //     console.log('DESTROY')
    //     socket.close()
    //     socket = null
    // }, 0.5 * 1000 * 60);

    function fake_update() {
        var fake_data = FAKE + fake(4);
        if (socket) socket.write(Buffer(fake_data));

        var timeout = 2000;

        if (Date.now() - start > 60 * 1.5 * 1000) {
            console.log('SOCKET stop sending')
        } else {
            clearme = setTimeout(fake_update, timeout);
        }
    }
});

server.listen(12345, '0.0.0.0')

var data = []
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
    var socketBufferSize = 0;
    sockets.forEach( s => {
        socketBufferSize += s.bufferSize;
    });

    console.log('Socket Buffer Size', (socketBufferSize / 1024 / 1024).toFixed(2), 'MB' )


}, 2000)