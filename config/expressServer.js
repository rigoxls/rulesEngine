var env = process.env.NODE_ENV || 'production',
    conf = require('../config/conf'),
    express = require('express'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    middlewares = require('../app/middlewares/admin');

var ExpressServer = function(config)
{
    config = config || {};

    this.expressServer = express();
    this.expressServer.locals.appUrl = conf.appUrl;

    //The bodyParser object exposes various factories to create middlewares.
    //All middlewares will populate the req.body property with the parsed body,
    //or an empty object ({}) if there was no body to parse (or an error was returned).
    this.expressServer.use( bodyParser.json() );
    //Returns middleware that only parses urlencoded bodies
    this.expressServer.use( bodyParser.urlencoded({ extended: false}) );

    this.expressServer.use(session({
        secret: 'smart-soft-session-secret',
        resave: false,
        saveUninitialized: false
    }));

    //working with middlewares
    for(var middleware in middlewares){
        this.expressServer.use(middlewares[middleware]);
    }

    //tell express we are goind to use swig
    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    swig.setDefaults({ varControls: ['[[', ']]'] });

    //where templates are located
    this.expressServer.set('views', __dirname + '/../app/modules/views/templates');

    if(env == 'development'){
        console.info('dev environment');
        this.expressServer.set('view cache', false);
        swig.setDefaults({cache: false, varControls: ['[[', ']]']});
    }else{
        console.info('this is prod environment');
    }
};

module.exports = ExpressServer;