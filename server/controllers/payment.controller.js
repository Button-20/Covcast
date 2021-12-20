const mongoose = require('mongoose');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');
var ObjectId = mongoose.Types.ObjectId;
var generator = require('generate-serial-number');
var prefix = 'CVS';

// Registering a Payment
module.exports.register = (req, res, next) => {
    var payment = new Payment({
    userid: req.body.userid,
    transaction_Code: prefix + generator.generate(10),
    modeOfPayment: req.body.modeOfPayment,
    subscription_plan: req.body.subscription_plan,
    currencyCode: req.body.currencyCode,
    amount: req.body.amount,
    description: req.body.description
    });
    if (req.body.userid == null || req.body.userid == "" || req.body.modeOfPayment == null || req.body.modeOfPayment == "" || req.body.subscription_plan == null || req.body.subscription_plan == "" || req.body.currencyCode == null || req.body.currencyCode == "" || req.body.amount == null || req.body.amount == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
        payment.save((err, doc) => {
            if (!err){
                res.send(doc)
                if(doc.amount === 150)
                    var subscription_end = oneMonthFromNow();

                var subscription = new Subscription({
                    userid: doc.userid,
                    plan_id: doc.subscription_plan,
                    subscription_end: subscription_end
                });
                subscription.save((err, doc) => {
                        if (!err){
                            var user = {
                                subscription: doc._id
                            }             
                            User.findByIdAndUpdate(doc.userid, {$set: user}, {new: true}, (err, doc) => {
                                if (!err) { console.log(doc) }
                                else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2))}; 
                            });
                        }
                        else 
                            return next(err);
                    });        
            }
            else {
                if (err.code == 11000)
                    res.status(422).send(['Duplicate Transaction Code found.']);
                else
                    return next(err);
            }

        });
    }
}

// Getting all payments array
module.exports.get = (req, res) => {
    Payment.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Payment :' + JSON.stringify(err, undefined, 2))}
    }).populate('subscription_plan userid');
}

// Getting all payments count
module.exports.getAllCount = (req, res) => {
    Payment.countDocuments({}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Payment Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all payment count with User ID
module.exports.getCount = (req, res) => {
    Payment.countDocuments({userid: req.params.userid}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Payment Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Finding a Payment with UserID
module.exports.getUserID = (req, res) => {
    Payment.find({userid: req.params.userid}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Payments :' + JSON.stringify(err, undefined, 2))};
    });
}


// Filter by date
module.exports.getAllPaymentDateFilter = (req, res) => {
    Payment.find({createdAt: {$gte: req.params.startdate, $lte: req.params.enddate}}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Payment with createdAt :' + JSON.stringify(err, undefined, 2))};
    });

}


// Finding an attendance with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Payment found with given id : ${req.params.id}`);

        Payment.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Payment :' + JSON.stringify(err, undefined, 2))};
        });
}


// Updating a payment with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Payment found with given id : ${req.params.id}`);
        
        var payment = {
            status: req.body.status
        };
        
        Payment.findByIdAndUpdate(req.params.id, {$set: payment}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Payment Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}


// // Deleting a attendance with ID
// module.exports.delete = (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No Attendance found with given id : ${req.params.id}`);
        
//        Attendance.findByIdAndRemove(req.params.id, (err, doc) => {
//             if (!err) { res.send(doc); }
//             else { console.log('Error in Retrieving Attendance :' + JSON.stringify(err, undefined, 2))};
//         });
// }

function oneMonthFromNow() {
    var d = new Date(); 
    var targetMonth = d.getMonth() + 1;
    d.setMonth(targetMonth);
    return d;
  }