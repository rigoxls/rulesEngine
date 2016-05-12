var Io = require('socket.io'),
    factService = require('../app/modules/services/factService'),
    _ = require('lodash');

var SocketIO = function(config){
    var config = config || {};
    var self = this;
    self.factService = new factService(config.app);

    //config.app

    //this line makes possible listen socket io on browser, /socket.io/socket.io.js
    var io = Io.listen(config.server);

    io.sockets.on('connection', function(socket)
    {
          socket.on('validateFacts', function(factObject)
          {
            var passedRules = self.factService.validateFacts(factObject);
            io.emit('validateResponse', passedRules);
          });
    });

    return io;
}

module.exports = SocketIO;