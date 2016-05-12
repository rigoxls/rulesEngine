var modelRule = require('./schema/ruleSchema'),
    modelCounters = require('./CountersModel'),
    mongoose = require('mongoose');

var RuleModel = function(conf){
    conf = conf || {};
    this.model = modelRule;
    this.countersModel = new modelCounters();
};

//return rule by Id
//@data object
//@callback function
//return object
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

//return list of rules
//@data object
//@callback function
//return object
RuleModel.prototype.list = function(data, callback)
{
    var query = {};
    var fields = (data.all) ? {} : {ruleId: 1, name: 1, _id: 0};

    this.model.find(
        query,
        fields,
        function(err, data){
            if(err){
                callback(err, data);
            }else{
                callback(null, data);
            }
        }
    );
};

//Insert rule
//@data object
//@callback function
//return object
RuleModel.prototype.insert = function(data, callback)
{
    this.countersModel.getNextSequence(function(ruleId){

        var predefinedData = {
                name        : data.name,
                condition   : data.condition,
                ruleId      : ruleId
            };

        var ruleObject = new modelRule(predefinedData);

        ruleObject.save(function(err, data){
            if(err){
                callback(err, data);
            }else{
                callback(null, data);
            }
        });
    });

};

//update rule
//@data object
//@callback function
//return object
RuleModel.prototype.update = function(data, callback)
{
    var ruleId = data.ruleId;
    var options = { multi: false, upsert: false};
    var settedValues = {};

    settedValues.name = data.name;
    settedValues.condition = data.condition;

    this.model.update(
    {
        ruleId: ruleId
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
