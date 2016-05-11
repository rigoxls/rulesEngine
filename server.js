var http = require('http'),
    conf = require('./config/conf'),
    mLab = conf.mongoLab,
    mongoose = require('mongoose'),
    expressServer = require('./config/expressServer'),
    env = process.env.NODE_ENV || 'production',
    socketIO = require('./config/socketIO');


mongoose.connect('mongodb://' + conf.mongoDB.host + '/' + conf.mongoDB.name);

var app = new expressServer();
var server = http.createServer(app.expressServer);
var Io = new socketIO({server: server});

//init routes
require('./routes.js')(app, Io);

server.listen(process.env.PORT || conf.port);