var RuleModel      = require('../models/RuleModel'),
    rulesetService = require('./rulesetService'),
    _q = require("q"),
    _ = require('lodash');

var RuleService = function()
{
    this.ruleModel = new RuleModel();
    this.rulesetService = new rulesetService();
};

RuleService.prototype.upsert = function(data, callback)
{
    var self = this;
    var upsert = (_.isEmpty(data.ruleId)) ? 'insert' : 'update';

    self.ruleModel[upsert](data, function(err, data){
        if(err){
            callback({ data: err, errorResponse: "Something went wrong upserting rule"});
        }
        else if(data){
            callback({ data: data, textResponse: "Rule Process executed Sucessfully"});
        }else{
            callback(null);
        }
    });
};

RuleService.prototype.get = function(data, callback)
{
    var self = this;
    self.ruleModel.getById(data, function(err, data){
        if(err){
            callback({ data: err, errorResponse: "Something went wrong getting rule"});
        }
        else if(data){
            callback({ data: data, textResponse: "Rule gotten Sucessfully"});
        }else{
            callback(null);
        }
    })
}

RuleService.prototype.listAll = function(data)
{
    var self = this;
    var deferred = _q.defer();

    self.ruleModel.list(data, function(err, data){
        if(err){
            err.error = true;
            deferred.resolve(err);
        }else{
            deferred.resolve(data);
        }
    });

    return deferred.promise;
};

RuleService.prototype.list = function(data, callback)
{
    var self = this;
    data.all = false;

    self.listAll(data).then(function(data){
        if(data.error){
            callback({ data: data, errorResponse: "Something went wrong listing rules"});
        }
        else{
            callback({ data: data, textResponse: "Rule listed Sucessfully"});
        }
    });
};

RuleService.prototype.generateConditions = function(req)
{
    var self = this;
    var data = {};
    data.all = true;

    self.listAll(data).then(function(data){
        if(data.error){
            console.info("Something went wrong listing rules");
        }
        else{
            req.app.locals.conditionalsObject = self.rulesetService.generate(data);
        }
    });
};

module.exports = RuleService;