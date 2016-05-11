var controllersManager = require('./app/modules/controllers/controllersManager'),
    conf = require('./config/conf');

var Routes = function(app){
    var controllers = [];

    for(var cm in controllersManager){
        controllers[cm] = new controllersManager[cm];
    };

    app.expressServer.get('/', function(req, res, next){
        controllers['ruleController'].request('home', req, res, next);
    });

    app.expressServer.get('/get/:ruleId', function(req, res, next){
        controllers['ruleController'].request('get', req, res, next);
    });

    app.expressServer.get('/list', function(req, res, next){
        controllers['ruleController'].request('list', req, res, next);
    });

    app.expressServer.get('/upsert', function(req, res, next){
        controllers['ruleController'].request('upsert', req, res, next);
    });

    app.expressServer.get('/conditionals', function(req, res, next){
        controllers['ruleController'].request('getConditionals', req, res, next);
    });

}

module.exports = Routes;