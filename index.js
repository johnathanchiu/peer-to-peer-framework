const Server = require('./js-framework/server.js');
const Client = require('./js-framework/client.js');


var server = new Server(1337, type='ADHOC', ssid='test', password='123');
server.setCloseHandler();
server.destroy();
