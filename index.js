const Server = require('./js-framework/server.js');

var server = new Server(1337, type='ADHOC', ssid='test', password='123');

server.invokeKillHandler();
server.setConnHandler(function () {
    console.log("Connection!");
});
server.listen();
