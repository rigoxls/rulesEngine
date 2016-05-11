var Io = require('socket.io'),
    _ = require('lodash');

var SocketIO = function(config){
    var config = config || {};
    var self = this;

    //this line makes possible listen socket io on browser, /socket.io/socket.io.js
    var io = Io.listen(config.server);

    io.sockets.on('connection', function(socket){
          socket.on('validateFacts', function(msg){
            console.log('message: ' + msg);
            io.emit('validateResponse', msg);
          });
    });

    return io;
}

module.exports = SocketIO;