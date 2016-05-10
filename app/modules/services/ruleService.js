var RuleModel = require('../models/RuleModel'),
    _ = require('lodash');

var RestService = function()
{
    this.ruleModel = new RuleModel();
};

RestService.prototype.upsert = function(data, callback)
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

RestService.prototype.get = function(data, callback)
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

RestService.prototype.list = function(data, callback)
{
    var self = this;
    self.ruleModel.list(data, function(err, data){
        if(err){
            callback({ data: err, errorResponse: "Something went wrong listing rules"});
        }
        else if(data){
            callback({ data: data, textResponse: "Rule listed Sucessfully"});
        }else{
            callback(null);
        }
    })
};

module.exports = RestService;