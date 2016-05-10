var modelRule = require('./schema/ruleSchema'),
    mongoose = require('mongoose');

var RuleModel = function(conf){
    conf = conf || {};
    this.model = modelRule;
};

module.exports = RuleModel;
