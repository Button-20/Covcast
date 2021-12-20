const mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
    classname: { type: String, ref: 'User' },
    firstname: {
        type: String,
        required: 'First name can\'t be empty'
    },
    lastname: {
        type: String,
        required: 'Last name can\'t be empty'
    },
    othername: {
        type: String
    },
    gender: {
        type: String
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
    },
    digitaladdress: {
        type: String,
        required: 'Digital Address can\'t be empty'
    },
    phonenumber: {
        type: String,
        required: 'Phone number can\'t be empty',
        unique: true
    },
    dateofbirth: {
        type: Date,
        required: 'Date of Birth can\'t be empty'
    }
}, {timestamps: true});

module.exports = mongoose.model("Member", memberSchema);