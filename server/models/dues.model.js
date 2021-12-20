const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var duesSchema = new Schema({
    classname: { type: String, ref: 'User' },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'User ID can\'t be empty'
    },
    membername: {
        type: String,
        ref: 'Member',
        required: 'Member Name can\'t be empty'
    },
    amount: {
        type: Number,
        required: 'Amount can\'t be empty'
    },    
    dateofpayment:{
        type: Date
    },
    description:{
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("Dues", duesSchema);