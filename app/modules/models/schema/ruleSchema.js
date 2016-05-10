var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RuleSchema = new Schema({
    name: String,
    provider: String,
    provider_id: {type: String, unique: true},
    photo: String,
    cretatedAt: {type: Date, default: Date.now}
});

var RuleSchema = mongoose.model('Rules', RuleSchema);

module.exports = RuleSchema;