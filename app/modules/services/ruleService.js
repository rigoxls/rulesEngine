var RuleModel      = require('../models/RuleModel'),
    rulesetService = require('./rulesetService'),
    _q = require("q"),
    _ = require('lodash');

var RuleService = function()
{
    this.ruleModel = new RuleModel();
    this.rulesetService = new rulesetService();
};

//Method to create or update rule
//@data object
//@callback function
//return object
RuleService.prototype.upsert = function(data, callback)
{
    var self = this;
    var upsert = (_.isEmpty(data.ruleId)) ? 'insert' : 'update';

    var ruleValidated = self.rulesetService.generate([data]);

    //if not basic errors create rule
    if(ruleValidated.errors.length == 0)
    {
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
    }else
    {
        var err = {
            'errors' : ruleValidated.errors
        };
        callback({ data: err, errorResponse: "Something went wrong upserting rule"});
    }

};

//Method to get rule
//@data object
//@callback function
//return object
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

//Method to list rules, a promise
//@data object
//@callback function
//return a Q promise
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

//Method to generate rules
//@data object
//@callback function
//return object
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
            var rulesValidated = self.rulesetService.generate(data);
            req.app.locals.conditionalsObject = rulesValidated.codedRules;
            //console.info(req.app.locals.conditionalsObject);
        }
    });
};

module.exports = RuleService;