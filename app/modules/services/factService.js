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

//Method to validate facts
//@data object
//return array (consequences)
FactService.prototype.validateFacts = function(factObject)
{
    var self = this;
    var passedRules = [];
    var app = self.app;
    var conditions = app.locals.conditionalsObject;

    factObject = self.transformObject(factObject);

    if(factObject.error){
        return factObject.error;
    }

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

//transform json from view
FactService.prototype.transformObject = function(factObject)
{
    try {
        factObject = eval("(" + factObject + ')');
    }catch (e)
    {
        return { 'error' : 'Not valid JSON' };
    }

    return factObject;
}

module.exports = FactService;