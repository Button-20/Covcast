const mongoose = require('mongoose');
var  Subscription = require('../models/subscription.model');
var ObjectId = mongoose.Types.ObjectId;

// Registering Subscription
module.exports.register = (req, res, next) => {
    var subscription = new Subscription({
        userid: req.body.userid,
        plan_id: req.body.plan_id,
        subscription_start: req.body.subscription_start,
        subscription_end: req.body.subscription_end
    });
    if (req.body.userid == null || req.body.userid == "" || req.body.plan_id == null || req.body.plan_id == "" || req.body.subscription_start == null || req.body.subscription_start == "" || req.body.subscription_end == null || req.body.subscription_end == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
        subscription.save((err, doc) => {
                if (!err)
                    res.send(doc);
                else 
                    return next(err);
            });
    }
}

// Getting all Subscription array
module.exports.get = (req, res) => {
    Subscription.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Subscription :' + JSON.stringify(err, undefined, 2))}
    }).populate('userid plan_id');
}


// Finding a Subscription with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Subscription found with given id : ${req.params.id}`);

        Subscription.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Subscription :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding a Plan Count
module.exports.getCount = (req, res) => {
        Plan.countDocuments({}, (err, doc) => {
            if (!err) { res.json(doc); }
            else { console.log('Error in Retrieving Plan Count :' + JSON.stringify(err, undefined, 2))};
        });
}


// Updating a Subscription with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Subscription found with given id : ${req.params.id}`);
        
        var subscription = {
            userid: req.body.userid,
            plan_id: req.body.plan_id,
            subscription_start: req.body.subscription_start,
            subscription_end: req.body.subscription_end
            };
        
        Subscription.findByIdAndUpdate(req.params.id, {$set: subscription}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Subscription Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}


// // Deleting a Subscription with ID
// module.exports.delete = (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No Subscription found with given id : ${req.params.id}`);
        
//         Subscription.findByIdAndRemove(req.params.id, (err, doc) => {
//             if (!err) { res.send(doc); }
//             else { console.log('Error in Retrieving Subscription :' + JSON.stringify(err, undefined, 2))};
//         });
// }