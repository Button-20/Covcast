const mongoose = require('mongoose');
var Task = require('../models/task.model');
var ObjectId = require('mongoose').Types.ObjectId;

// Registering Task
module.exports.register = (req, res, next) => {
    var task = new Task({
    userid: req.body.userid,
    classname: req.body.classname,
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    startdate: req.body.startdate,
    enddate: req.body.enddate
    });
    if (req.body.userid == null || req.body.userid == "" || req.body.classname == null || req.body.classname == "" || req.body.name == null || req.body.name == "" || req.body.description == null || req.body.description == "" || req.body.status == null || req.body.status == "" || req.body.startdate == null || req.body.startdate == "" || req.body.enddate == null || req.body.enddate == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
        task.save((err, doc) => {
                if (!err)
                    res.send(doc);
                else
                    return next(err);
            });
    }
}

// Getting all tasks array
module.exports.get = (req, res) => {
    Task.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Tasks :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all tasks count
module.exports.getAllCount = (req, res) => {
    Task.countDocuments({}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Task Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all tasks count with classname
module.exports.getCount = (req, res) => {
    Task.countDocuments({classname: req.params.classname}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Task Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Filter by date
module.exports.getAllTaskDateFilter = (req, res) => {
    Task.find({date: {$gte: req.params.startdate, $lte: req.params.enddate}}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Task with Date :' + JSON.stringify(err, undefined, 2))};
    });

}


// Finding an task with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Task found with given id : ${req.params.id}`);

        Task.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Attendance :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding an tasks with Classname
module.exports.getClassname = (req, res) => {
        Task.find({classname: req.params.classname}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Task with Classname :' + JSON.stringify(err, undefined, 2))};
        });
}


// Updating a Task with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Task found with given id : ${req.params.id}`);
        
        var task = {
            userid: req.body.userid,
            classname: req.body.classname,
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            startdate: req.body.startdate,
            enddate: req.body.enddate
        };
        
        Task.findByIdAndUpdate(req.params.id, {$set: task}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Task Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}


// Deleting a task with ID
module.exports.delete = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Task found with given id : ${req.params.id}`);
        
    Task.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Task :' + JSON.stringify(err, undefined, 2))};
    });
}