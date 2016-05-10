var conf = require('../../../config/conf'),
    restService = require('../services/restService');

var Home = function()
{
    this.restService = new restService();

    //this method take the request and redirect it to properly method
    this.request = function(action, req, res, next)
    {
        this[action](req, res, next);
    };

    //if a response is in format JSON is requered, this method is used
    this.JSONresponse = function(res, textResponse, data, user)
    {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            textResponse: textResponse,
            data: data,
            user: user
        }));
    }
};

Home.prototype.home = function(req, res, next)
{
    var object = {};
    res.render('home', object);
};

Home.prototype.upsert = function(req, res, next)
{
    var self = this;

    if(!req.query){
        console.info('body is empty');
        return false;
    }

    var data = req.query;

    self.restService['upsert'](data, function(resData)
    {
        if(resData){
            self.JSONresponse(res, resData.textResponse, resData.data, data.user);
        }
        else{
            console.info('something went wrong : upsert method rule');
        }
    })
};

Home.prototype.list = function(req, res, next)
{
    var self = this;

    if(!req.query){
        console.info('body is empty');
        return false;
    }

    var data = req.query;

    self.restService['list'](data, function(resData)
    {
        if(resData){
            self.JSONresponse(res, resData.textResponse, resData.data, data.user);
        }
        else{
            console.info('something went wrong : listing rules');
        }
    })
};

module.exports = Home;