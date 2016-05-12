var modelCounters = require('./schema/countersSchema'),
    mongoose = require('mongoose');

var CountersModel = function(conf){
    conf = conf || {};
    this.model = modelCounters;
};

CountersModel.prototype.getNextSequence = function(callback)
{
    this.model.findOneAndUpdate({
        _id: 'ruleId'
    },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }).exec(function(err, doc)
    {
        //if first time doc will be null
        var seq = (doc == null) ? 1 : doc.seq;
        callback(seq);
    });
}

module.exports = CountersModel;
