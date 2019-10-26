const net = require('net');
var wifi = require('node-wifi');

function Client(ssid, password) {
	wifi.init({ iface: null });
	wifi.connect({ ssid: ssid, password: pass }, function (err) {
	    if (err) {
	        console.log(err);
	    }
	});
}

Client.prototype.onConn = function (socket, ip, connHandler=null) {
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
        if (writeHandler) {
            success = this.client.write(data, writeHandler);
        } else {
            success = this.client.write(data);
        }
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

Client.prototype.setCloseHandler = function (closeHandler) {
	this.client.on('close', closeHandler);
	cmdStr = './adhoc-kill';
	exec(cmdStr, (err, stdout, stderr) => {
		if (err) {
			console.log(stderr);
		}
	});

}
