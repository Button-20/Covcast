const mongoose = require('mongoose');
var  Subscription = require('../models/subscription.model');
var  User = require('../models/user.model');
var ObjectId = mongoose.Types.ObjectId;
const path = require('path');
const exceljs = require("exceljs");



// Registering Subscription
module.exports.register = (req, res, next) => {
    if (req.body.type === 'Monthly') {
        var subscription = new Subscription({
            userid: req.body.userid,
            plan_id: req.body.plan_id,
            subscription_end: oneMonthFromNow(),
        });
    } else if (req.body.type === 'Yearly'){
        var subscription = new Subscription({
            userid: req.body.userid,
            plan_id: req.body.plan_id,
            subscription_end: oneYearFromNow(),
        });
    } else
        return res.status(422).send(['Ensure all fields were provided.']);;
        
    if (req.body.userid == null || req.body.userid == "" || req.body.plan_id == null || req.body.plan_id == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
        subscription.save((err, doc) => {
                if (!err){
                    var user = {
                        subscription: doc._id
                    }         
                    User.findByIdAndUpdate(req.body.userid, {$set: user}, {new: true}, (err, doc) => {
                        if (!err) { res.send(doc); }
                        else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2))}; 
                    });
                }
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
    }).populate('plan_id');
}

// Finding a Subscription Count
module.exports.getCount = (req, res) => {
    Subscription.countDocuments({}, (err, doc) => {
            if (!err) { res.json(doc); }
            else { console.log('Error in Retrieving Plan Count :' + JSON.stringify(err, undefined, 2))};
        });
}

// Filter by date
module.exports.getAllSubscriptionDateFilter = (req, res) => {
    Subscription.find({subscription_end: {$gte: req.params.startdate, $lte: req.params.enddate}}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Payment with Subscription End :' + JSON.stringify(err, undefined, 2))};
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
            subscription_end: req.body.subscription_end,
            status: req.body.status
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

module.exports.downloadExcel = async (req, res) => {
        console.log('Admin Download')
        Subscription.find({}, async (err, doc) => {
            if (!err) {
                let subscriptions = [];
    
                doc.forEach((subscription)  => {
                    subscriptions.push({
                        userid: subscription.userid.fullname,
                        plan_id: subscription.plan_id.name,
                        subscription_start: subscription.subscription_start,
                        subscription_end: subscription.subscription_end,
                        status: subscription.status
                 
                    }) 
                })
    
                let workbook = new exceljs.Workbook();
                let worksheet = workbook.addWorksheet('Subscriptions');
        
                worksheet.columns = [
                    { header: "User Name", key: "userid", width: 20 },
                    { header: "Plan Name", key: "plan_id", width: 20 },
                    { header: "Subscription Start", key: "subscription_start", width: 20 },
                    { header: "Subscription End", key: "subscription_end", width: 20 },
                    { header: "Status", key: "status", width: 10 }
                  ];
    
                // Add Array Rows
                worksheet.addRows(subscriptions);
                
                // Making first line in excel bold
                worksheet.getRow(1).eachCell((cell) => {
                    cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                    cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'FFFF33' } }
                });
                
                const route = path.join('./exports/subscriptions');  // Path to download excel
                    
                try {
                    const data = await workbook.xlsx.writeFile(`${route}/${Date.now()}__Subscriptions__Export.xlsx`)
                     .then(() => {
                       res.send({
                         status: "Success",
                         message: "File successfully downloaded",
                         path: `${route}/${Date.now()}__Subscriptions__Export.xlsx`,
                        });
                     });
                } catch (err) {
                      res.status(500).send({
                      status: "error",
                      message: "Something went wrong",
                    });
                }
            }
            else { res.status(500).send({ message: 'Error in Retrieving Subscriptions: ' + JSON.stringify(err, undefined, 2)}), console.log('Error in Retrieving Member: ' + JSON.stringify(err, undefined, 2))};
        }).populate('plan_id userid');    
}

function oneMonthFromNow() {
    var d = new Date(); 
    var targetMonth = d.getMonth() + 1;
    d.setMonth(targetMonth);
    return d;
  }

function oneYearFromNow() {
    var d = new Date(); 
    var targetMonth = d.getMonth() + 12;
    d.setMonth(targetMonth);
    return d;
  }