var modelRule = require('./schema/ruleSchema'),
    mongoose = require('mongoose');

var RuleModel = function(conf){
    conf = conf || {};
    this.model = modelRule;
};

RuleModel.prototype.getById = function(data, callback)
{
    var query = {
        _id: data.ruleId
    };

    this.model.findOne(
        query,
        function(err, data){
            if(err){
                callback(err, data);
            }else{
                callback(null, data);
            }
        }
    )
};

RuleModel.prototype.list = function(data, callback)
{
    var query = {};

    this.model.find(
        query,
        {_id: 1, name: 1},
        function(err, data){
            if(err){
                callback(err, data);
            }else{
                callback(null, data);
            }
        }
    )
};

RuleModel.prototype.insert = function(data, callback)
{
    var predefinedData = {
        name        : data.name,
        condition   : data.condition
    };

    var ruleObject = new modelRule(predefinedData);

    ruleObject.save(function(err, data){
        if(err){
            callback(err, data);
        }else{
            callback(null, data);
        }
    });
};

RuleModel.prototype.update = function(data, callback)
{
    var ruleId = data.ruleId;
    var options = { multi: false, upsert: false};
    var settedValues = {};

    settedValues.name = data.name;
    settedValues.condition = data.condition;

    this.model.update(
    {
        _id: ruleId
    },
    {
        $set: settedValues
    },
    options,
    function(err, data){
        if(err){
            callback(err, data);
        }else{
            callback(null, data);
        }
    })
};

module.exports = RuleModel;
