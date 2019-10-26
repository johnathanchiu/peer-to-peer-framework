const os = require('os');
const net = require('net');


const { exec, spawn } = require('child_process');


function Server(type, socket, ssid=null, password=null) {
    if (type == 'P2P' && ) {
        if (process.platform != 'darwin') {
            throw "This os cannot host as server.";
        }
        if (ssid == null && password == null) {
            throw "No name/password provided for ad-hoc network.";
        }
        cmdStr = './adhoc-network ' + ssid + ' ' + password;
        exec(cmdStr, (err, stdout, stderr) => {
            if (err) {
                console.log(stderr);
            }
        });
    }
    this.server = net.createServer();
    this.sock = socket;
}

Server.prototype.listen = function () {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    if (addresses.length < 1) {
        throw "Failed to find ip for server.";
    }
    this.ip = addresses[0];
    this.server.listen(this.sock, this.ip);
    this.server.on('connection');
}

Server.prototype.setConnHandler = function (connHandler) {
    this.server.on('connection', connHandler);
}

Server.prototype.destroy = function (closeHandler=null) {
    if (this.server.getConnections() > 0) {
        throw "Cannot close server til all clients are removed.";
    }
    if (closeHandler === null) {
        this.server.on('close', function () {
            cmdStr = './adhoc-kill';
            exec(cmdStr, (err, stdout, stderr) => {
                if (err) {
                    console.log(stderr);
                }
            });
            exit();
        }
    }
    this.server.on('close', closeHandler);
    cmdStr = './adhoc-kill';
    exec(cmdStr, (err, stdout, stderr) => {
        if (err) {
            console.log(stderr);
        }
    });
    exit();
}

Server.prototype.write = function (data, writeHandler=null) {
    var success = false;
    try {
        if (writeHandler) {
            success = this.server.write(data, writeHandler);
        } else {
            success = this.server.write(data);
        }
    } catch (e) {
        console.log(e);
    }
    if (!successs) {
        throw "Unable to successfully write data to clients.";
    }
}
