var http = require('http');

if (process.argv.length < 3) {
    console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' http://bla.com/ connections');
    process.exit(1);
}

var target = process.argv[2];

var port = target[1];
var host = target[0];

var connections =  +process.argv[3] || 100;

console.log('Running...', connections + ' connections', process.argv)
for (var i = 0; i < connections; i++) {
    connect_one(i, target);
}

function connect_one(i, target) {
    var hostname = target.split(':')[0];
    var port = target.split(':')[1] || 54321;
    
    var options = {
        hostname: hostname,
        port: port,
        method: 'GET',
        path: '/'
    };
    
    var req = http.request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`, i);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`, i);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`, i);
        });
        res.on('end', () => {
            console.log('No more data in response.', i)
        })
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`, i);
    });
    
    // write data to request body
    // req.write('');
    req.end();

}