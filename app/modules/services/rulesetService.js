var _ = require('lodash');

var RulesetService = function(){};

RulesetService.prototype.generate = function(data)
{
    var self = this;
    var codedRules = [];

    for(var i in data){
        codedRules.push(self.getResultByType(JSON.parse(data[i].condition)));
    }

    console.info(codedRules);
    return codedRules;
};

RulesetService.prototype.getResultByType = function(condition)
{
    var self = this;
    var result = '';
    if(_.isEmpty(condition.type)) return false;

    var type = condition.type;

    switch(type)
    {
        case 'or'       :
        case 'and'      : result = self.andOrType(condition);
            break;

        case 'sub'      :
        case 'div'      : result = self.subDivType(condition);
            break;

        case 'add'      :
        case 'mul'      : result = self.addMulType(condition);
            break;

        case 'compare'  : result = self.compareType(condition);
            break;

        case 'constant' : result = self.constantType(condition);
            break;

        case 'fact'     : result = self.factType(condition);
            break;
    };

    return result;
};

RulesetService.prototype.andOrType = function(data)
{
    var self = this;
    var result = '';
    if(_.isEmpty(data.inputs)) return false;

    var operator = (data.type == 'or') ? ' || ' : ' && ';

    var inputs = data.inputs;
    var iLength = data.inputs.length;

    for(var i in inputs){
        result += '(' + self.getResultByType(inputs[i]) + ')';
        if(i < iLength-1){
            result += operator;
        }
    }

    return result;
};

RulesetService.prototype.addMulType = function(data)
{
    var self = this;
    var result = '';

    if(_.isEmpty(data.inputs)) return false;

    var operator = (data.type == 'add') ? ' + ' : ' * ';

    var inputs = data.inputs;
    var iLength = data.inputs.length;

    for(var i in inputs){
        result += self.getResultByType(inputs[i]);
        if(i < iLength-1){
            result += operator;
        }
    }

    return '(' + result + ')';
};

RulesetService.prototype.subDivType = function(data)
{
    var self = this;
    if(_.isEmpty(data.a) || _.isEmpty(data.b)) return false;

    var operator = (data.type == 'sub') ? ' - ' : ' / ';

    var scriptA = self.getResultByType(data.a);
    var scriptB = self.getResultByType(data.b);

    return '(' + scriptA + ' / ' + scriptB + ')';
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

    if( !data.svalue && !data.value) return false;

    return (_.isEmpty(data.svalue)) ? data.value : data.svalue; //cambiar a notacion ||
};

module.exports = RulesetService;


