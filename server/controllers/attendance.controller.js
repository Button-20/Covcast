const mongoose = require('mongoose');
var Attendance = require('../models/attendance.model');
var ObjectId = mongoose.Types.ObjectId;
const path = require('path'); 
const readXlsxFile = require("read-excel-file/node");
const exceljs = require("exceljs");

// Registering Member Attendance
module.exports.register = (req, res, next) => {
    var attendance = new Attendance({
    userid: req.body.userid,
    classname: req.body.classname,
    membername: req.body.membername,
    date: req.body.date,
    temperature: req.body.temperature,
    event: req.body.event,
    present: req.body.present
    });
    if (req.body.userid == null || req.body.userid == "" || req.body.classname == null || req.body.classname == "" || req.body.membername == null || req.body.membername == "" || req.body.date == null || req.body.date == "" || req.body.event == null || req.body.event == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
            attendance.save((err, doc) => {
                if (!err)
                    res.send(doc);
                else {
                    if (err.code == 11000)
                        res.status(422).send(['Duplicate Data found.']);
                    else
                        return next(err);
                }

            });
    }
}

// Getting all attendance array
module.exports.get = (req, res) => {
    Attendance.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Attendance :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all attendance count
module.exports.getAllCount = (req, res) => {
    Attendance.countDocuments({}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Attendance Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all attendance count with classname
module.exports.getCount = (req, res) => {
    Attendance.countDocuments({classname: req.params.classname}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Attendance Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Filter by date
module.exports.getAllAttendanceDateFilter = (req, res) => {
    Attendance.find({date: {$gte: req.params.startdate, $lte: req.params.enddate}}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Attendance with Date :' + JSON.stringify(err, undefined, 2))};
    });

}


// Finding an attendance with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Attendance found with given id : ${req.params.id}`);

        Attendance.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Attendance :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding an attendance with Classname
module.exports.getClassname = (req, res) => {
        Attendance.find({classname: req.params.classname}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Attendance with Classname :' + JSON.stringify(err, undefined, 2))};
        });
}


// Updating a attendance with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Attendance found with given id : ${req.params.id}`);
        
        var attendance = {
            userid: req.body.userid,
            classname: req.body.classname,
            membername: req.body.membername,
            date: req.body.date,
            temperature: req.body.temperature,
            event: req.body.event,
            present: req.body.present
        };
        
        Attendance.findByIdAndUpdate(req.params.id, {$set: attendance}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Attendance Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}


// Deleting a attendance with ID
module.exports.delete = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No Attendance found with given id : ${req.params.id}`);
        
       Attendance.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Attendance :' + JSON.stringify(err, undefined, 2))};
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
    
          let attendances = [];
    
          rows.forEach((row) => {
            let attendance = {
                userid: req.body.userid,
                classname: row[0],
                membername: row[1],
                date: Date(row[2]),
                temperature: row[3],
                event: row[4],
                present: Boolean(row[5])           
            };
            attendances.push(attendance);
            console.log(attendances);

            Attendance.insertMany(attendances, (err, doc) => {
                if (!err) { res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    result: doc
                  }); }
                else { res.status(500).send({ message: 'Error in Dues Insert :' + JSON.stringify(err, undefined, 2)}), console.log('Error in Members Insert :' + JSON.stringify(err, undefined, 2))}; 
            });
    
          });
        });
        
    }catch(error){
        console.log(error);
        res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
        });
    }
}

module.exports.downloadExcel = async (req, res) => {
    if (req.params.classname !== 'Admin') {
        console.log(req.params.classname)
        Attendance.find({classname: req.params.classname}, async (err, doc) => {
            if (!err) {
                let attendances = [];
    
                doc.forEach((attendance)  => {
                    attendances.push({
                        classname: attendance.classname,
                        membername: attendance.membername,
                        date: attendance.date,
                        temperature: attendance.temperature,
                        event: attendance.event,
                        present: attendance.present
                    }) 
                })
    
                let workbook = new exceljs.Workbook();
                let worksheet = workbook.addWorksheet('Attendances');
        
                worksheet.columns = [
                    { header: "Class Name", key: "classname", width: 15 },
                    { header: "Member's Name", key: "membername", width: 25 },
                    { header: "Date", key: "date", width: 15 },
                    { header: "Temperature", key: "temperature", width: 15 },
                    { header: "Event", key: "event", width: 20 },
                    { header: "Present", key: "present", width: 10 },
                  ];
    
                // Add Array Rows
                worksheet.addRows(attendances);
                
                // Making first line in excel bold
                worksheet.getRow(1).eachCell((cell) => {
                    cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                    cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'FFFF33' } }
                });
                
                const route = path.join('./exports/attendances');  // Path to download excel
                    
                try {
                    const data = await workbook.xlsx.writeFile(`${route}/${Date.now()}__Attendance__Export.xlsx`)
                     .then(() => {
                       res.send({
                         status: "Success",
                         message: "File successfully downloaded",
                         path: `${route}/${Date.now()}__Attendance__Export.xlsx`,
                        });
                     });
                } catch (err) {
                      res.status(500).send({
                      status: "error",
                      message: "Something went wrong",
                    });
                }
            }
            else { res.status(500).send({ message: 'Error in Retrieving Attendances: ' + JSON.stringify(err, undefined, 2)}), console.log('Error in Retrieving Member: ' + JSON.stringify(err, undefined, 2))};
        });    

    }else{
        console.log('Admin Download')
        Attendance.find({}, async (err, doc) => {
            if (!err) {
                let attendances = [];
    
                doc.forEach((attendance)  => {
                    attendances.push({
                        classname: attendance.classname,
                        membername: attendance.membername,
                        date: attendance.date,
                        temperature: attendance.temperature,
                        event: attendance.event,
                        present: attendance.present
                    }) 
                })
    
                let workbook = new exceljs.Workbook();
                let worksheet = workbook.addWorksheet('Attendances');
        
                worksheet.columns = [
                    { header: "Class Name", key: "classname", width: 15 },
                    { header: "Member's Name", key: "membername", width: 25 },
                    { header: "Date", key: "date", width: 15 },
                    { header: "Temperature", key: "temperature", width: 15 },
                    { header: "Event", key: "event", width: 20 },
                    { header: "Present", key: "present", width: 10 },
                  ];
    
                // Add Array Rows
                worksheet.addRows(attendances);
                
                // Making first line in excel bold
                worksheet.getRow(1).eachCell((cell) => {
                    cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                    cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'FFFF33' } }
                });
                
                const route = path.join('./exports/attendances');  // Path to download excel
                    
                try {
                    const data = await workbook.xlsx.writeFile(`${route}/${Date.now()}__Attendances__Export.xlsx`)
                     .then(() => {
                       res.send({
                         status: "Success",
                         message: "File successfully downloaded",
                         path: `${route}/${Date.now()}__Attendances__Export.xlsx`,
                        });
                     });
                } catch (err) {
                      res.status(500).send({
                      status: "error",
                      message: "Something went wrong",
                    });
                }
            }
            else { res.status(500).send({ message: 'Error in Retrieving Attendances: ' + JSON.stringify(err, undefined, 2)}), console.log('Error in Retrieving Member: ' + JSON.stringify(err, undefined, 2))};
        });    
    }

}