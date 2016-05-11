var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var RuleSchema = new Schema({
    name       : {type: String, required: true},
    condition  : {type: Schema.Types.Mixed, required: true},
    cretatedAt : {type: Date, default: Date.now},
    updatedAt  : {type: Date, default: Date.now}
});

var RuleSchema = mongoose.model('Rules', RuleSchema);

//check if condition field is an object
RuleSchema.schema.path('condition').validate(function (value) {

    try {
        return _.isObject(JSON.parse(value));
    } catch (e) {
      return false;
    }

}, 'Invalid value for condition, it should be a JSON object');

//check if name has unless 10 chars as a name
RuleSchema.schema.path('name').validate(function (value) {
    return (value.length >= 7);
}, 'Name should have unless 10 characters');


module.exports = RuleSchema;