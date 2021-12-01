const mongoose = require('mongoose');

var Member = mongoose.model('Member', {
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
    },
    created:{
        type: Date,
        default: Date.now()
    }

});

module.exports = { Member };