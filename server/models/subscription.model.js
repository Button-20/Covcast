const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var subscriptionSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        required: 'User ID can\'t be empty',
        ref: 'User'
    },
    plan_id: {
        type: Schema.Types.ObjectId,
        required: 'Plan ID can\'t be empty',
        ref: 'Plan'
    },
    subscription_start: {
        type: Date,
        required: 'Subscription Start can\'t be empty',
        default: Date.now()
    },
    subscription_end: {
        type: Date,
        required: 'Subscription End can\'t be empty',
    },
    status: {
        type: String,
        required: 'Status can\'t be empty',
        default: 'Active'
    }
}, {timestamps: true});

module.exports = mongoose.model("Subscription", subscriptionSchema);