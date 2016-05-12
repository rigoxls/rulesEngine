var  ruleService = require('./ruleService'),
    _q = require("q"),
    _ = require('lodash');

var FactService = function(app)
{
    this.app = app.expressServer;
    this.ruleService = new ruleService();
    //we need to be sure rules were loaded
    this.ruleService.generateConditions({app : this.app });
};

FactService.prototype.validateFacts = function(factObject)
{
    var self = this;
    var passedRules = [];
    var app = self.app;
    var conditions = app.locals.conditionalsObject;

    factObject = self.transformObject(factObject);

    //creating local values
    for(var i in conditions){
        try {
            var ruleResult = eval(conditions[i]);
            if(ruleResult){
                passedRules.push(i);
            }
        }catch (e)
        {
           console.info('Rule descarted !');
        }
    }
    return passedRules;
};

FactService.prototype.transformObject = function(factObject)
{
    try {
        factObject = JSON.parse(factObject);
    }catch (e)
    {
       factObject = eval("(" + factObject + ')');
    }

    return factObject;
}

module.exports = FactService;