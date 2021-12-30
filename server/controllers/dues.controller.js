const mongoose = require('mongoose');
var  Dues = require('../models/dues.model');
var ObjectId = mongoose.Types.ObjectId;
const path = require('path'); 
const readXlsxFile = require("read-excel-file/node");

// Registering Member Dues
module.exports.register = (req, res, next) => {
    var dues = new Dues({
    classname: req.body.classname,
    userid: req.body.userid,
    membername: req.body.membername,
    amount: req.body.amount,
    dateofpayment: req.body.dateofpayment,
    description: req.body.description
    });
    if (req.body.classname == null || req.body.classname == "" || req.body.userid == null || req.body.userid == "" || req.body.membername == null || req.body.membername == "" || req.body.amount == null || req.body.amount == "" || req.body.dateofpayment == null || req.body.dateofpayment == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
            dues.save((err, doc) => {
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

// Getting all dues array
module.exports.get = (req, res) => {
    Dues.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Dues :' + JSON.stringify(err, undefined, 2))}
    });
}


// Finding a dues with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Dues found with given id : ${req.params.id}`);

        Dues.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Dues :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding a Dues Count
module.exports.getCount = (req, res) => {
        Dues.countDocuments({}, (err, doc) => {
            if (!err) { res.json(doc); }
            else { console.log('Error in Retrieving Dues Count :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding Dues with Classname
module.exports.getClassname = (req, res) => {
        Dues.find({classname: req.params.classname}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Dues with Classname :' + JSON.stringify(err, undefined, 2))};
        });
}

// Sum Dues with Classname
module.exports.getSum = (req, res) => {
    Dues.aggregate([
        { $match: { classname: req.params.classname } },
        { $group: { _id: "$classname", TotalSumOfDues: { $sum: "$amount" } } } ]
        , (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Dues with Classname :' + JSON.stringify(err, undefined, 2))};
        });
}


// Filter by date
module.exports.getAllDateFilter = (req, res) => {
    Dues.find({dateofpayment: {$gte: req.params.startdate, $lte: req.params.enddate}}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Dues with Date :' + JSON.stringify(err, undefined, 2))};
    });

}

// Sum All Dues
module.exports.getAllSum = (req, res) => {
    Dues.aggregate([
        { $match: {  } },
        { $group: { _id: "", TotalSumOfDues: { $sum: "$amount" } } } ]
        , (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Dues with Classname :' + JSON.stringify(err, undefined, 2))};
        });
}



// Updating a dues with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Dues found with given id : ${req.params.id}`);
        
        var dues = {
            classname: req.body.classname,
            userid: req.body.userid,
            membername: req.body.membername,
            amount: req.body.amount,
            dateofpayment: req.body.dateofpayment,
            description: req.body.description
        };
        
        Dues.findByIdAndUpdate(req.params.id, {$set: dues}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Dues Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}


// Deleting a dues with ID
module.exports.delete = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Dues found with given id : ${req.params.id}`);
        
       Dues.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Dues :' + JSON.stringify(err, undefined, 2))};
        });
}

module.exports.uploadExcel = async (req, res) => {
    try {
        // console.log(req)
        if (req.file == undefined) {
          return res.status(400).send("Please upload an excel file!");
        }
    
        let route = path.join('./excel-documents/' + req.file.filename);
    
        readXlsxFile(route).then((rows) => {
            // skip header
            rows.shift();

            let dues = [];
    
            rows.forEach((row) => {
            let due = {
                classname: row[0],
                userid: req.body.userid,
                membername: row[1],
                amount: row[2],
                dateofpayment: Date(row[3]),
                description: row[4]
            };
                dues.push(due);
                console.log(dues);
            });

            Dues.insertMany(dues, (err, doc) => {
                if (!err) { res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    result: doc
                }); }
                else { res.status(500).send({ message: 'Error in Dues Insert :' + JSON.stringify(err, undefined, 2)}), console.log('Error in Members Insert :' + JSON.stringify(err, undefined, 2))}; 
            });
        });
        
    }catch(error){
        console.log(error);
        res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
        });
    }
}
