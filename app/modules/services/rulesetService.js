var _ = require('lodash');

var RulesetService = function(){};

RulesetService.prototype.generate = function(data)
{
    var self = this;
    var codedRules = [];
    this.errors = [];

    for(var i in data){
        codedRules.push(self.getResultByType(JSON.parse(data[i].condition)));
    }

    return {
        'codedRules' : codedRules,
        'errors'     : self.errors
    }
};

RulesetService.prototype.getResultByType = function(condition)
{
    var self = this;
    var result = '';
    if(_.isEmpty(condition.type)){
        self.errors.push({
            'message' : 'condition.type not found, please check your JSON rule'
        });
        return false;
    }

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
    if(_.isEmpty(data.inputs)){
        self.errors.push({
            'message' : 'and | or conditions don\'t have inputs, please check your JSON rule'
        });
        return false;
    }

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

    if(_.isEmpty(data.inputs)){
        self.errors.push({
            'message' : 'add | mul conditions don\'t have inputs, please check your JSON rule'
        });
        return false;
    }

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
    if(_.isEmpty(data.a) || _.isEmpty(data.b)){
        self.errors.push({
            'message' : 'sub | div conditions don\'t have defined a and b objects, please check your JSON rule'
        });
        return false;
    }

    var operator = (data.type == 'sub') ? ' - ' : ' / ';

    var scriptA = self.getResultByType(data.a);
    var scriptB = self.getResultByType(data.b);

    return '(' + scriptA + ' / ' + scriptB + ')';
};

RulesetService.prototype.compareType = function(data) /* not or | and operators */
{
    var self = this;
    var result;
    if(_.isEmpty(data.a) || _.isEmpty(data.b) || _.isEmpty(data.condition)){
        self.errors.push({
            'message' : 'Compare condition doesn\'t have a,b or condition object, please check your JSON rule'
        });
        return false;
    }

    if(data.a.type == 'or' || data.a.type == 'and' ||
        data.b.type == 'or' || data.b.type == 'and')
    {
        self.errors.push({
            'message' : 'Compare condition shouldn\'t have nested OR | AND operators, please check your JSON rule'
        });
        return false;
    }

    var scriptA = self.getResultByType(data.a);
    var scriptB = self.getResultByType(data.b);

    switch(data.condition)
    {
        case 'like'   :
        case '!like'  : result = self.likeCondition(scriptA, scriptB, data.condition);
            break;

        case 'regex'  :
        case '!regex' : result = self.regexCondition(scriptA, scriptB, data.condition);
            break;

        default       : result = scriptA + ' ' + data.condition + ' ' + scriptB;
    }

    return result;
};

RulesetService.prototype.factType = function(data)
{
    var self = this;
    if(_.isEmpty(data.field)){
        self.errors.push({
            'message' : 'fact type condition doesn\'t have field "field", please check your JSON rule'
        });
        return false;
    }

    return data.field;
};

RulesetService.prototype.constantType = function(data)
{
    var self = this;

    if( !data.svalue && !data.value){
        self.errors.push({
            'message' : 'Constant condition doesn\'t have svalue or value, please check your JSON rule'
        });
        return false;
    }

    return (_.isEmpty(data.svalue)) ? data.value : data.svalue;
};

RulesetService.prototype.likeCondition = function(scriptA, scriptB, condition)
{
    var self = this;
    var negative = (condition == 'like') ? '' : '!';

    return '('+ negative + scriptA + '.match(/'+ scriptB +'/i) > -1)';
};

RulesetService.prototype.regexCondition = function(scriptA, scriptB, condition)
{
    var self = this;
    var negative = (condition == 'regex') ? '' : '!';

    //case of regex , second field need to be a regex constant
    return '('+ negative + scriptA + '.match(/'+ scriptB +'/i) > -1)';
};

module.exports = RulesetService;


