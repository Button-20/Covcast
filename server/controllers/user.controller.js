const passport = require('passport');
var ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jasonaddy51@gmail.com',
        pass: 'gxpbewhpsvwaqdun'
    }
});

module.exports.register = (req, res, next) => {
    var user = new User();
    user.classname = req.body.classname;
    user.fullname = req.body.fullname;
    user.password = req.body.password;
    user.phonenumber = req.body.phonenumber;
    user.email = req.body.email;
    user.occupation = req.body.occupation;
    user.address = req.body.address;
    user.loginPermission = req.body.loginPermission;
    user.subscription = req.body.subscription;
    
    if (req.body.classname == null || req.body.classname == "" || req.body.fullname == null || req.body.fullname == "" || req.body.password == null || req.body.password == "" || req.body.phonenumber == null || req.body.phonenumber == "" || req.body.email == null || req.body.email == "" || req.body.occupation == null || req.body.occupation == "" || req.body.address == null || req.body.address == "" || req.body.loginPermission == null || req.body.loginPermission == "")
    {
        res.status(422).send(['Ensure all fields were provided.']);
    }
    else{
            user.save((err, doc) => {
                if (!err)
                    res.send(doc);
                else {
                    if (err.code == 11000)
                        res.status(422).send(['Duplicate email address found.']);
                    else
                        return next(err);
                }

            });
    }
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user){
            try {
                Subscription.findById(user.subscription, async (err, doc) => {
                    // console.log(doc)
                    if (doc === null) return res.status(422).json({message: 'You do not have a subscription. Please contact admin.'});
                    else if (!err) return res.status(200).json({"token": await user.generateJwt(doc.plan_id.name)});
                    else { console.log('Error in Retrieving Subscription on Token Generation :' + JSON.stringify(err, undefined, 2))};
                }).populate('plan_id');        
            } catch (error) {
                res.status(400).json(error);
            }
        }
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

// Getting all users array
module.exports.get = (req, res) => {
    User.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retrieving Users :' + JSON.stringify(err, undefined, 2))}
    });
}

// Finding a user with ID
module.exports.getID = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No user found with given id : ${req.params.id}`);

        User.findById(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retrieving User :' + JSON.stringify(err, undefined, 2))};
        }).populate({ path: 'subscription', populate: { path: 'plan_id', model: 'Plan'}});
}

// Updating a user with ID
module.exports.put = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No User found with given id : ${req.params.id}`);
        
        var user = {
            classname: req.body.classname,
            fullname: req.body.fullname,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            occupation: req.body.occupation,
            address: req.body.address,
            loginPermission: req.body.loginPermission
        }

        User.findByIdAndUpdate(req.params.id, {$set: user}, {new: true}, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2))}; 
        });
}

module.exports.resetPassword = (req, res) => {
    User.findOne({ email: req.params.email}, (err, doc) => {
        if (err) { console.log('Error in Retrieving User :' + JSON.stringify(err, undefined, 2))}
        else { 
            if(!doc) res.json({message: 'Email was not found'}) 
            else {
                var token = jwt.sign({email: req.params.email}, process.env.JWT_SECRET, {expiresIn: '24h'});
                transporter.sendMail({
                    from: 'Localhost Staff, staff@localhost.com',
                    to: req.params.email,
                    subject: 'Password Reset',
                    text: 'Hello ' + doc.fullname + ', thank you for registering at localhost.com. Please click on the link to complete the reset process: http://localhost:4200/auth/reset-password/confirm/' + token,
                    html: 'Hello <strong>'+ doc.fullname +'</strong>, <br><br> You recently requested a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:4200/auth/reset-password/confirm/'+ token +'">http://localhost:4200/auth/reset-password/confirm/</a>'
                  },
                  (err, info) => {
                    if(err) console.log(err);
                    else console.log('Email sent: ' + info.response)
                  }
                );

                res.json({message: 'Password Reset Request has been sent to your email.'});
            }
        };
})
}

module.exports.updatePassword = async (req, res) => {
    // Verify token from url params
    await jwt.verify(req.params.token, process.env.JWT_SECRET,
        async (err, decoded) => {
            if (err)
                return res.status(422).send({ auth: false, message: 'Password link has expired or is invalid.' });
            else{
                //Verify user within database then continue
                await User.findOne({ email: decoded.email}, (err, doc) => {
                    if (err) { console.log('Error in Retrieving User :' + JSON.stringify(err, undefined, 2))}
                    else {
                        if(doc == null) return res.json({message: 'Email was not found'}) 
                        else {
                            if(req.body.password === null || req.body.password === "") {
                                res.status(422).json({message: 'Password not provided!'});
                            }else{
                                
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                                        var user = {
                                            password: hash,
                                            saltSecret: salt
                                        }
                                        User.findOneAndUpdate(decoded.email, {$set: user}, {new: true}, (err, doc) => {
                                            if (err) {
                                                console.log('Error in User Password Update :' + JSON.stringify(err, undefined, 2))
                                            } else {
                                                // Create email object to send to user
                                                transporter.sendMail({
                                                    from: 'Localhost Staff, staff@localhost.com',
                                                    to: decoded.email,
                                                    subject: 'Localhost Reset Password',
                                                    text: 'Hello ' + doc.fullname + ', This email is to notify you that your password was recently reset at localhost.com',
                                                    html: 'Hello <strong>'+ doc.fullname +'</strong>,<br><br>This email is to notify you that your password was recently reset at localhost.com'
                                                  },
                                                  (err, info) => {
                                                    if(err) console.log(err);
                                                    else console.log('Email sent: ' + info.response)
                                                  }
                                                );
                                                res.json({message: 'Password Reset Successfully!'});
                                            }
                                        })
                                    });
                                });
                            }
                        }
                    };
                })                
            } 
        }
    )

}

// // Updating a member login permission with ID
// module.exports.putLoginPermission = (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No member found with given id : ${req.params.id}`);
        
//         var user = {
//             loginPermission: req.body.loginPermission
//         }

//         User.findByIdAndUpdate(req.params.id, {$set: user}, {new: true}, (err, doc) => {
//             if (!err) { res.send(doc); }
//             else { console.log('Error in Member Update :' + JSON.stringify(err, undefined, 2))}; 
//         });
// }


// Deleting a member with ID
module.exports.delete = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No member found with given id : ${req.params.id}`);
        
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retrieving Member :' + JSON.stringify(err, undefined, 2))};
    });
}
