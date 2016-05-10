var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RuleSchema = new Schema({
    name       : String,
    condition  : Schema.Types.Mixed,
    cretatedAt : {type: Date, default: Date.now},
    updatedAt  : {type: Date, default: Date.now}
});

var RuleSchema = mongoose.model('Rules', RuleSchema);

module.exports = RuleSchema;