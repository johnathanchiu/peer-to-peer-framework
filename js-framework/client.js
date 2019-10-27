const net = require('net');
var wifi = require('node-wifi');

function Client(ssid, pass) {
	wifi.init({ iface: null });
	wifi.connect({ ssid: ssid, password: pass }, function (err) {
	    if (err) {
	        console.log(err);
	    }
	});
}

Client.prototype.createConn = function (socket, ip, connHandler=null) {
	this.client = net.Socket();
	if (connHandler) {
		this.client.connect(socket, ip, connHandler);
	} else {
		this.client.connect(socket, ip, function () {
			console.log("Connection established!");
		});
	}
}

Client.prototype.write = function (data, writeHandler=null) {
	var success = false;
    try {
        success = this.client.write(data, writeHandler);
    } catch (e) {
        console.log(e);
    }
    if (!successs) {
        throw "Unable to successfully write data to Server.";
    }
}

Client.prototype.setDataHandler = function (recHandler) {
	this.client.on('data', recHandler);
}

Client.prototype.setCloseHandler = function (closeHandler=null) {
	this.client.on('close', function () {
        if (closeHandler != null) {
            closeHandler();
        }
    });
}

Client.prototype.destroy = function (endAll=false) {
	this.client.destroy();
	cmdStr = './adhoc-kill';
	exec(cmdStr, (err, stdout, stderr) => {
		if (err) {
			console.log(stderr);
		}
	});
	if (endAll) {
		process.exit();
	}
}

Client.prototype.invokeKillHandler = function () {
    var self = this;
    process.on('SIGINT', function() {
        console.log("Closing socket.");
        self.destroy(endAll=true);
    });
}

module.exports = Client;
