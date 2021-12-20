require('./config/config');
require('./models/db');
require('./config/passportconfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const cron = require('node-cron');
const rtsIndex = require('./routes/index.router');
const User = require('./models/user.model');
const Subscription = require('./models/subscription.model');


var app = express();
var allowedDomains = ['http://localhost:4200', 'https://alias-egroups.web.app'];

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);
   
      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));
app.use(passport.initialize());
app.use('/api', rtsIndex);

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server started at port : ${process.env.PORT}`)

  cron.schedule('* * * * *', () => {
    // console.log('Runs every minute');

// Checks for user login permissions and put them at their rightful positions
    User.find((err, docs) => {
      if (!err) {
        docs.forEach(user => {
          if (user.loginPermission === false && new Date(user.subscription.subscription_end) < Date.now()) {
            console.log('User cannot login and Subscription Period is past')
          } else if (user.loginPermission === true && new Date(user.subscription.subscription_end) < Date.now()){

            var data = {
              loginPermission: false,
            }
            User.findByIdAndUpdate(user._id, {$set: data}, {new: true}, (err, doc) => {
              if (!err) { console.log(doc) }
              else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2))}; 
            });
            console.log('User can login but Subscription Period is past')

          } else if(user.loginPermission === false && new Date(user.subscription.subscription_end) > Date.now()){

            var data = {
              loginPermission: true,
            }
            User.findByIdAndUpdate(user._id, {$set: data}, {new: true}, (err, doc) => {
              if (!err) { console.log(doc) }
              else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2))}; 
            });
            console.log('User cannot login but Subscription Period is yet to come')

          }
        })
      }
      else { console.log('Error in retrieving Users :' + JSON.stringify(err, undefined, 2))}
    }).populate('subscription');

// Checks for subscription periods and sets status to their rightful states
    Subscription.find((err, docs) => {
      if (!err) {
        docs.forEach(subscription => {
          if (new Date(subscription.subscription_end) < Date.now() && subscription.status === 'Inactive') {
            console.log('Subscription Period is past and Status is Inactive')
          } else if (new Date(subscription.subscription_end) < Date.now() && subscription.status === 'Active'){

            var data = {
              status: 'Inactive'
            }
            Subscription.findByIdAndUpdate(subscription._id, {$set: data}, {new: true}, (err, doc) => {
              if (!err) { console.log(doc) }
              else { console.log('Error in Subscription Update :' + JSON.stringify(err, undefined, 2))}; 
            });
            console.log('Subscription Period is past and Status is Active')

          } else if(new Date(subscription.subscription_end) > Date.now() && subscription.status === 'Inactive'){

            var data = {
              status: 'Active'
            }
            User.findByIdAndUpdate(subscription._id, {$set: data}, {new: true}, (err, doc) => {
              if (!err) { console.log(doc) }
              else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2))}; 
            });
            console.log('Subscription Period is yet to come and Status is Inactive')
            
          }
        })
      }
      else { console.log('Error in retrieving subscriptions:' + JSON.stringify(err, undefined, 2))}
    })
  })
});

