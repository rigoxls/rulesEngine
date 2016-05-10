var conf = require('../../../config/conf');

var Home = function(){
    this.request = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Home.prototype.home = function(req, res, next){
    var object = {};
    res.render('home', object);
}

module.exports = Home;