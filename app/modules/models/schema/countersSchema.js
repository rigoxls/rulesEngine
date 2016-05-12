var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CountersSchema = new Schema({
    _id : {type: String, default: 'ruleId'},
    seq : {type: Number, default: 1},
});

var CountersSchema = mongoose.model('Counters', CountersSchema);

module.exports = CountersSchema;