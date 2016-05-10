var controllersManager = require('./app/modules/controllers/controllersManager'),
    conf = require('./config/conf');

var Routes = function(app){
    var controllers = [];

    for(var cm in controllersManager){
        controllers[cm] = new controllersManager[cm];
    };

    app.expressServer.get('/', function(req, res, next){
        controllers['homeController'].request('home', req, res, next);
    });

}

module.exports = Routes;