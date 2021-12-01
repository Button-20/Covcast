const mongoose = require('mongoose');

var Attendance = mongoose.model('Attendance', {
    userid: {
        type: String,
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
    },
    created:{
        type: Date,
        default: Date.now()
    }

});

module.exports = { Attendance };