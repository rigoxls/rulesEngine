var conf = require('../../../config/conf'),
    ruleService = require('../services/ruleService');

var Rule = function()
{
    this.ruleService = new ruleService();

    //this method take the request and redirect it to properly method
    this.request = function(action, req, res, next)
    {
        this[action](req, res, next);
    };

    //if a response is in format JSON is requered, this method is used
    this.JSONresponse = function(res, textResponse, data)
    {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            textResponse: textResponse,
            data: data
        }));
    }
};

Rule.prototype.home = function(req, res, next)
{
    var self = this;
    var object = {};

    res.render('home', object);
};

Rule.prototype.upsert = function(req, res, next)
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
            self.JSONresponse(res, resData.textResponse, resData.data);
            //we regenerate all rules
            self.ruleService['generateConditions'](req);
        }
        else{
            console.info('something went wrong : upsert method rule');
        }
    })
};

Rule.prototype.list = function(req, res, next)
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
            self.JSONresponse(res, resData.textResponse, resData.data);
        }
        else{
            console.info('something went wrong : listing rules');
        }
    });
};

Rule.prototype.get = function(req, res, next)
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
            self.JSONresponse(res, resData.textResponse, resData.data);
        }
        else{
            console.info('something went wrong getting rule per id');
        }
    });
}

Rule.prototype.getConditionals = function(req, res, next)
{
    var self = this;
    self.JSONresponse(res, 'Current conditionals', req.app.locals.conditionalsObject);
}


module.exports = Rule;