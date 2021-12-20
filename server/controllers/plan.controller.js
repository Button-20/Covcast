const mongoose = require('mongoose');
var  Plan = require('../models/plan.model');
var ObjectId = require('mongoose').Types.ObjectId;

// Registering Plan
module.exports.register = (req, res, next) => {
    var plan = new Plan({
        name: req.body.name,
        price_per_month: req.body.price_per_month,
        price_per_year: req.body.price_per_year
    });
    if (req.body.name == null || req.body.name == "" || req.body.price_per_month == null || req.body.price_per_month == "" || req.body.price_per_year == null || req.body.price_per_year == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
        plan.save((err, doc) => {
                if (!err)
                    res.send(doc);
                else {
                    if (err.code == 11000)
                        res.status(422).send(['Something went wrong. Please contact admin.']);
                    else
                        return next(err);
                }

            });
    }
}

// Getting all Plan array
module.exports.get = (req, res) => {
    Plan.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Plan :' + JSON.stringify(err, undefined, 2))}
    });
}


// Finding a Plan with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Plan found with given id : ${req.params.id}`);

        Plan.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Plan :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding all Plan Count
module.exports.getCount = (req, res) => {
        Plan.countDocuments({}, (err, doc) => {
            if (!err) { res.json(doc); }
            else { console.log('Error in Retrieving Plan Count :' + JSON.stringify(err, undefined, 2))};
        });
}


// Updating a Plan with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Plan found with given id : ${req.params.id}`);
        
        var plan = {
            Name: req.body.Name,
            Price_per_month: req.body.Price_per_month,
            Price_per_year: req.body.Price_per_year
        };
        
        Plan.findByIdAndUpdate(req.params.id, {$set: plan}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Plan Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}


// Deleting a Plan with ID
module.exports.delete = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Plan found with given id : ${req.params.id}`);
        
       Plan.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Plan :' + JSON.stringify(err, undefined, 2))};
        });
}