const os = require('os');
const net = require('net');

const { exec, spawn } = require('child_process');

function Server(socket, type='ADHOC', ssid=null, password=null) {
    if (type == 'ADHOC') {
        if (process.platform != 'darwin') {
            throw "This os cannot host as server.";
        }
        if (ssid == null && password == null) {
            throw "No name/password provided for ad-hoc network.";
        }
        cmdStr = './js-framework/adhoc-network ' + ssid + ' ' + password;
        exec(cmdStr, (err, stdout, stderr) => {
            if (err) {
                console.log(stderr);
            }
        });
    } else {
        if (type != 'LAN') {
            throw "Unidentified method of networking (Use either \'LAN\' or \'ADHOC\')";
            process.exit(0);
        }
    }
    this.sock = socket;
    this.server = net.createServer();

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

Server.prototype.setCloseHandler = function (closeHandler=null) {
    this.server.on('close', function () {
        if (closeHandler != null) {
            closeHandler();
        }
        cmdStr = './js-framework/adhoc-kill';
        exec(cmdStr, (err, stdout, stderr) => {
            if (err) {
                console.log(stderr);
            }
        });
    });
}

Server.prototype.destroy = function () {
    this.server.getConnections(function (err, count) { this.globalConns = count; });
    if (this.globalConns > 0) {
        throw "Cannot close server til all clients are removed.";
    }
    // Pass a timeout to ensure network is created before removing conn.
    var ref = this.server;
    var ensureConn = new Promise(function (resolve, reject) {
        setTimeout(function () { resolve(ref); } , 7000);
    });
    ensureConn.then(function (reference) { reference.close(); });
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

module.exports = Server;
