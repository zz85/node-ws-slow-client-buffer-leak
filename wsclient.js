var WebSocket = require('ws');

if (process.argv.length < 3) {
    console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' ws://bla.com/ connections');
    process.exit(1);
}

var target = process.argv[2];

console.log('target', target);

var parts = target.split(':');

var port = parts[1];
var host = parts[0];

var connections =  +process.argv[3] || 100;

console.log('Running...', connections + ' connections', process.argv)
for (var i = 0; i < connections; i++) {
    connect_one(i, target);
}


function connect_one(i, target) {
    var ws = new WebSocket(target, {
        rejectUnauthorized: false
    });

    ws.on('open', function open() {
        console.log('Connected!!', i)
    });

    ws.on('message', function(data, flags) {
        // do nothing
    });

    ws.on('error', function(e) {
        console.log('Error', e);
    });

    ws.on('close', function() {
        console.log('Closed', i);
    });
}
