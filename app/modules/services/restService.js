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

    self.ruleModel[upsert](data, function(data){
        if(data){
            var textResponse = "Upsert Process executed Sucessfully";
            callback({ data: data, textResponse: textResponse});
        }
        else{
            callback(null);
        }
    });
};

RestService.prototype.getById = function(data, callback)
{
};


RestService.prototype.list = function(data, callback)
{
    var self = this;
    self.ruleModel.list(data, function(data){
        if(data){
            var textResponse = 'List of rules gotten';
            callback({data: data, textResponse: textResponse});
        }else{
            callback(null);
        }
    })
};

module.exports = RestService;