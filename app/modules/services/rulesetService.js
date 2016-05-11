var _ = require('lodash');

var RulesetService = function(){};

RulesetService.prototype.generate = function(data)
{
    var self = this;
    var result = '';

    for(var i in data){
        result += self.getResultByType(JSON.parse(data[i].condition));
    }

    return result;
};

RulesetService.prototype.getResultByType = function(condition)
{
    var self = this;
    if(_.isEmpty(condition.type)) return false;

    var type = condition.type;

    switch(type){
        case 'or'       : self.orType(condition);
            break;
        case 'and'      : self.andType(condition);
            break;
        case 'sub'      : self.subType(condition);
            break;
        case 'div'      : self.divType(condition);
            break;
        case 'add'      : self.addType(condition);
            break;
        case 'mul'      : self.mulType(condition);
            break;
        case 'compare'  : self.compareType(condition);
            break;
        case 'constant' : self.constantType(condition);
            break;
        case 'fact'     : self.factType(condition);
            break;
    }
};

RulesetService.prototype.orType = function(data)
{
    var self = this;
    var result = '';
    if(_.isEmpty(data.inputs)) return false;

    var inputs = data.inputs;
    var iLength = data.inputs.length;

    for(var i in inputs){
        result += self.getResultByType(inputs[i]);
        if(i < iLength){
            result += ' || ';
        }
    }

    return result;
};

RulesetService.prototype.andType = function(data)
{
    var self = this;
    var result = '';

    if(_.isEmpty(data.inputs)) return false;

    var inputs = data.inputs;
    var iLength = data.inputs.length;

    for(var i in inputs){
        result += self.getResultByType(inputs[i]);
        if(i < iLength){
            result += ' && ';
        }
    }

    return result;
};

RulesetService.prototype.compareType = function(data) /* validar que compare solo tenga objectos constant o fact */
{
    var self = this;
    if(_.isEmpty(data.a) || _.isEmpty(data.b) || _.isEmpty(data.condition)) return false;

    var scriptA = self.getResultByType(data.a);
    var scriptB = self.getResultByType(data.b);

    //validate case regex
    return scriptA + ' ' + data.condition + ' ' + scriptB;
};

RulesetService.prototype.factType = function(data)
{
    var self = this;
    if(_.isEmpty(data.field)) return false;

    return data.field;
};

RulesetService.prototype.constantType = function(data)
{
    var self = this;
    if(_.isEmpty(data.svalue) && _.isEmpty(data.value)) return false;

    return (data.value) ? data.value : data.svalue; //cambiar a notacion ||
};

module.exports = RulesetService;


//fact, and, or, div, sub, mul, add, compare, constant

//run all rules
//