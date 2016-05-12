var  ruleService = require('./ruleService'),
    _q = require("q"),
    _ = require('lodash');

var FactService = function(app)
{
    this.app = app;
    this.ruleService = new ruleService();
};

FactService.prototype.validateFacts = function(factObject)
{
    var self = this;
    var passedRules = [];
    var app = self.app.expressServer;
    var conditions = app.locals.conditionalsObject;

    factObject = eval("(" + factObject + ')');

    //creating local values
    for(var i in conditions){
        try {
            var ruleResult = eval(conditions[i]);
            if(ruleResult){
                passedRules.push(conditions[i]);
            }
        }catch (e)
        {
           console.info('false rule');
        }
    }

    console.info(passedRules);

};

module.exports = FactService;