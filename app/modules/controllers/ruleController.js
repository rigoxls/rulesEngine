var conf = require('../../../config/conf'),
    ruleService = require('../services/ruleService');

var Home = function()
{
    this.ruleService = new ruleService();

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
    var self = this;
    var object = {};

    self.ruleService['generateConditions']();

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

    self.ruleService['upsert'](data, function(resData)
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
    };

    var data = req.query;

    self.ruleService['list'](data, function(resData)
    {
        if(resData){
            self.JSONresponse(res, resData.textResponse, resData.data, data.user);
        }
        else{
            console.info('something went wrong : listing rules');
        }
    });
};

Home.prototype.get = function(req, res, next)
{
    var self = this;

    if(!req.params){
        console.info('body is empty');
        return false;
    };

    var data = req.params;

    self.ruleService['get'](data, function(resData)
    {
        if(resData){
            self.JSONresponse(res, resData.textResponse, resData.data, data.user);
        }
        else{
            console.info('something went wrong getting rule per id');
        }
    });
}


module.exports = Home;