const os = require('os');
const net = require('net');
const { exec, spawn } = require('child_process');

function Server(socket, type='LAN', ssid=null, password=null) {
    if (type == 'ADHOC') {
        if (process.platform != 'darwin') {
            throw "This os cannot host as server.";
        }
        if (ssid == null || password == null) {
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
            throw "Unidentified method of networking (Use either \'LAN\' or \'ADHOC\').";
            process.exit(0);
        }
    }
    this.sock = socket;
    this.server = net.createServer();
    this.LAN = (type == 'ADHOC');
}

Server.prototype.listen = function () {
    var ref = this;
    function beginListener(instance) {
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
            return 0;
        }
        instance.ip = addresses[0];
        console.log(instance.ip);
        instance.server.listen(instance.sock, instance.ip);
        return 1;
    }

    function ensureConnectivity() {
        var awaitConn = new Promise(function (resolve, reject) {
            setTimeout(function () { resolve(ref); }, 3000);
        });
        awaitConn.then(function (reference) {
            var success = beginListener(reference);
            if (success == 1) {
                return;
            } else {
                ensureConnectivity();
            }
        });
    }
    ensureConnectivity();
}

Server.prototype.setConnHandler = function (connHandler) {
    this.server.on('connection', connHandler);
}

Server.prototype.setCloseHandler = function (closeHandler=null) {
    this.server.on('close', function () {
        if (closeHandler != null) {
            closeHandler();
        }
    });
}

Server.prototype.destroy = function (endAll=false) {
    this.server.getConnections(function (err, count) { this.globalConns = count; });
    if (this.globalConns > 0) {
        throw "Cannot close server til all clients are removed.";
    }
    this.server.close();
    console.log("Destroying ad-hoc network.");

    cmdStr = './js-framework/adhoc-kill';
    exec(cmdStr, (err, stdout, stderr) => {
        if (err) {
            console.log(stderr);
        }
    });

    if (endAll) {
        process.exit();
    }
}

Server.prototype.write = function (data, writeHandler) {
    var success = false;
    try {
        success = this.server.write(data, writeHandler);
    } catch (e) {
        console.log(e);
    }
    if (!successs) {
        throw "Unable to successfully write data to clients.";
    }
}

Server.prototype.invokeKillHandler = function () {
    var self = this;
    process.on('SIGINT', function() {
        console.log("Closing socket.");
        self.destroy(endAll=true);
    });
}

module.exports = Server;
