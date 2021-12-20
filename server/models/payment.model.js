const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var paymentSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        required: 'User ID can\'t be empty',
        ref: 'User'
    },
    transaction_Code: {
        type: String,
        required: 'Transaction Code can\'t be empty',
        unique: true
    },
    modeOfPayment: {
        type: String,
        required: 'Mode Of Payment can\'t be empty'
    },
    subscription_plan: {
        type: Schema.Types.ObjectId,
        required: 'Subscripton Plan can\'t be empty',
        ref: 'Plan'
    },
    currencyCode: {
        type: String,
        required: 'Currency Code can\'t be empty'
    },
    amount: {
        type: Number,
        required: 'Amount can\'t be empty'
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: 'Status can\'t be empty',
        default: 'Pending'
    }
}, {timestamps: true})

module.exports = mongoose.model("Payment", paymentSchema);