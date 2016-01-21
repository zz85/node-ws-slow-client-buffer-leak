var net = require('net');

if (process.argv.length < 3) {
    console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' target:port connections');
    process.exit(1);
}

var target = process.argv[2].split(':');

var port = target[1];
var host = target[0];

var connections =  +process.argv[3] || 100;

console.log('Running...', connections + ' connections', process.argv)
for (var i = 0; i < connections; i++) {
    connect_one(i, port, host);
}

function connect_one(i, port, host) {
    var client = new net.Socket();

    client.connect(port, host, function() {
        console.log('Connected!!', i);
    });

    client.on('data', function(data, flags) {
    });

    client.on('close', function() {
        console.log('Closed', i);
    })

    client.on('error', function() {
        console.log('Error', i);
    })
}