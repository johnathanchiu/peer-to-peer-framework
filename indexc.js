const Client = require('./js-framework/client.js');

var client = new Client('test', '123');
client.invokeKillHandler();
client.createConn(1337, '169.254.103.67');
