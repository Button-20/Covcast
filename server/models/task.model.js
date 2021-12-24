const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var taskSchema = new Schema({
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
    name: {
        type: String,
        required: 'Task Name can\'t be empty'
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: 'Task Status can\'t be empty',
    },
    startdate: {
        type: Date,
        required: 'Start Date can\'t be empty',
        default: Date.now()
    },
    enddate: {
        type: Date,
        required: 'End Date can\'t be empty'
    }
}, {timestamps: true});

module.exports = mongoose.model("Task", taskSchema);