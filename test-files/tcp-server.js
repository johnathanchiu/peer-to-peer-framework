const net = require('net')

var server = net.createServer();

server.on('connection', function(c) {
    console.log("New Connection!");
    c.write("Hello!");
});

server.on('data', function(data) {
	console.log('Received: ' + data);
});

server.on('close', function(data) {
    console.log('');
});

// server.listen(1337, '127.0.0.1');
server.listen(1337, '169.254.146.198');
