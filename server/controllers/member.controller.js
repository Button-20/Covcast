var Member = require('../models/member.model');
var SmsLog = require('../models/sms-log.model');
var ObjectId = require('mongoose').Types.ObjectId;
var unirest = require('unirest');
const path = require('path'); 
const smsApiUrl = 'https://sms.nalosolutions.com/smsbackend/clientapi/Resl_Nalo';
const readXlsxFile = require("read-excel-file/node");


// Registering a Member
module.exports.register = (req, res, next) => {
    var mem = new Member({
    classname: req.body.classname,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    othername: req.body.othername,
    gender: req.body.gender,
    email: req.body.email,
    digitaladdress: req.body.digitaladdress,
    phonenumber: req.body.phonenumber,
    dateofbirth: req.body.dateofbirth
    });
    if (req.body.firstname == null || req.body.firstname == "" || req.body.lastname == null || req.body.lastname == "" || req.body.gender == null || req.body.gender == "" || req.body.email == null || req.body.email == "" || req.body.digitaladdress == null || req.body.digitaladdress == "" || req.body.phonenumber == null || req.body.phonenumber == "" || req.body.dateofbirth == null || req.body.dateofbirth == ""){
        res.status(422).send(['Ensure all fields were provided.']);
    }else{
            mem.save((err, doc) => {
                if (!err)
                    res.send(doc);
                else {
                    if (err.code == 11000)
                        res.status(422).send(['Duplicate Phone Number found.']);
                    else
                        return next(err);
                }

            });
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Getting all members array
module.exports.get = (req, res) => {
    Member.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Members :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all members array with specific classnmae
module.exports.getCount = (req, res) => {
    Member.countDocuments({classname: req.params.classname}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Members Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all members array
module.exports.getAllCount = (req, res) => {
    Member.countDocuments({}, (err, docs) => {
        if (!err) { res.json(docs); }
        else { console.log('Error in retrieving Members Count :' + JSON.stringify(err, undefined, 2))}
    });
}

// Getting all members array
module.exports.getAllMaleCount = (req, res) => {
    Member.countDocuments({gender: "Male"}, (err, doc) => {
        if (!err) { res.json(doc); }
        else { console.log('Error in Retrieving Member Male :' + JSON.stringify(err, undefined, 2))};
    });
}

// Getting all members array
module.exports.getAllFemaleCount = (req, res) => {
    Member.countDocuments({gender: "Female"}, (err, doc) => {
        if (!err) { res.json(doc); }
        else { console.log('Error in Retrieving Member Male :' + JSON.stringify(err, undefined, 2))};
    });
}


// Finding a member with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No member found with given id : ${req.params.id}`);

        Member.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Member :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding a member with Classname
module.exports.getClassname = (req, res) => {
    Member.find({classname: req.params.classname}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Member :' + JSON.stringify(err, undefined, 2))};
    });
}

// Finding a member with Male Gender
module.exports.getMale = (req, res) => {
        Member.countDocuments({classname: req.params.classname, gender: "Male"}, (err, doc) => {
            if (!err) { res.json(doc); }
            else { console.log('Error in Retrieving Member Male :' + JSON.stringify(err, undefined, 2))};
        });
}

// Finding a member with Female Gender
module.exports.getFemale = (req, res) => {
        Member.countDocuments({classname: req.params.classname, gender: "Female"}, (err, doc) => {
            if (!err) { res.json(doc); }
            else { console.log('Error in Retrieving Member Female :' + JSON.stringify(err, undefined, 2))};
        });
}

// Updating a member with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No member found with given id : ${req.params.id}`);
        
        var mem = {
            classname: req.body.classname,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            othername: req.body.othername,
            gender: req.body.gender,
            email: req.body.email,
            digitaladdress: req.body.digitaladdress,
            phonenumber: req.body.phonenumber,
            dateofbirth: req.body.dateofbirth,
        };
        
        Member.findByIdAndUpdate(req.params.id, {$set: mem}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Member Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}


// Deleting a member with ID
module.exports.delete = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No member found with given id : ${req.params.id}`);
        
       Member.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving Member :' + JSON.stringify(err, undefined, 2))};
        });
}

async function sendSms (req, res, next){
    let data = {
        username: 'Bill123',
        password: 'Bill123',
        type: '0',
        dlr: '1',
        destination: req.body.destination,
        source: req.body.source,
        message: req.body.message
    }
    // console.log(req);
    var request = unirest('GET', `${smsApiUrl}/send-message/?username=${data.username}&password=${data.password}&type=${data.type}&dlr=${data.dlr}&destination=${data.destination}&source=${data.source}&message=${data.message}`)
        .headers({
            'Content-Type': ['application/json', 'application/json']
        })
        .end(
        async(resp) => {
            if (!resp.error){
                res.status(200).json('Sms Sent Successfully');
                var smslog = new SmsLog({
                    userid: req.body.userid,
                    message: req.body.message,
                    status: 'Success',
                    source: req.body.source,
                    destination: req.body.destination,
                })
                smslog.save((err, doc) => {
                    if (!err)
                        return console.log('Sms-Log saved: ' + doc)
                    else 
                        return next(err);
                })
            }
            else{
                res.status(400).json(resp.error);
                var smslog = new SmsLog({
                    userid: req.body.userid,
                    message: req.body.message,
                    status: 'Failed: ' + resp.error,
                    source: req.body.source,
                    destination: req.body.destination,
                })
                smslog.save((err, doc) => {
                    if (!err)
                        return console.log('Sms-Log saved: ' + doc)
                    else 
                        return next(err);
                })
            }
        })
}
module.exports.sendSms = sendSms;

module.exports.uploadExcel = async (req, res) => {
    try {
        if (req.file == undefined) {
          return res.status(400).send("Please upload an excel file!");
        }
    
        let route = path.join('./excel-documents/' + req.file.filename);
        console.log(route)
        readXlsxFile(route).then((rows) => {
          // skip header
          rows.shift();
    
          let members = [];
    
            rows.forEach((row) => {
            let member = {
                classname: row[0],
                firstname: row[1],
                lastname: row[2],
                othername: row[3],
                gender: row[4],
                email: row[5],
                digitaladdress: row[6],
                phonenumber: row[7],
                dateofbirth: Date(row[8]),
            };
            members.push(member);
        });
            console.log(members);  

            Member.insertMany(members, (err, doc) => {
                if (!err) { res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    result: doc
                }); }
                else { res.status(500).send({ message: 'Error in Members Insert :' + JSON.stringify(err, undefined, 2)}), console.log('Error in Members Insert :' + JSON.stringify(err, undefined, 2))}; 
            });
        });
        
    }catch(error){
        console.log(error);
        res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
        });
    }
}
