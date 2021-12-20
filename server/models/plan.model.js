const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var planSchema = new Schema({
    name: {
        type: String,
        required: 'Plan Name can\'t be empty',
        unique: true
    },
    price_per_month: {
        type: Number,
        required: 'Price Per Month can\'t be empty',
    },
    price_per_year: {
        type: Number,
        required: 'Price Per Year can\'t be empty',
    },
}, {timestamps: true});

module.exports = mongoose.model("Plan", planSchema);