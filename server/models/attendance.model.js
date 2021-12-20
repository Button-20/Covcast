const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        required: 'User ID can\'t be empty',
        ref: 'User'
    },
    classname: {
        type: String,
        required: 'Class Name can\'t be empty',
        ref: 'User'
    },
    membername: {
        type: String,
        required: 'Member Name can\'t be empty',
        ref: 'Member'
    },
    date: {
        type: Date,
        required: 'Date can\'t be empty',
    },
    temperature: {
        type: Number,
        required: 'Temperature can\'t be empty',
    },
    event: {
        type: String,
        required: 'Event can\'t be empty',
    },
    present: {
        type: Boolean,
        required: 'Present can\'t be empty',
    }
}, {timestamps: true});

module.exports = mongoose.model("Attendance", attendanceSchema);