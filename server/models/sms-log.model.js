const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var smslogSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        required: 'User ID can\'t be empty',
        ref: 'User'
    },
    message: {
        type: String,
        required: 'Message can\'t be empty',
    },
    status: {
        type: String,
        required: 'Status can\'t be empty',
    },
    source: {
        type: String,
        required: 'Source can\'t be empty',
    },
    destination: {
        type: Array,
        required: 'Destination can\'t be empty',
    }
}, {timestamps: true});

module.exports = mongoose.model("Sms-Log", smslogSchema);