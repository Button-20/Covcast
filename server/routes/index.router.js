const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');

const ctrlUser = require('../controllers/user.controller');
const ctrlMember = require('../controllers/member.controller');
const ctrlDues = require('../controllers/dues.controller');
const ctrlAttendance = require('../controllers/attendance.controller');
const ctrlTask = require('../controllers/task.controller');
const ctrlPlan = require('../controllers/plan.controller');
const ctrlSubscription = require('../controllers/subscription.controller');
const ctrlPayment = require('../controllers/payment.controller');
// const uploadFile = require('../controllers/member.controller');

// Users
router.post('/register', ctrlUser.register);
router.get('/reset-password/:email', ctrlUser.resetPassword);
router.post('/password-reset/confirm/:token', ctrlUser.updatePassword);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/users', jwtHelper.verifyJwtToken, ctrlUser.get);
router.get('/users/:id',jwtHelper.verifyJwtToken, ctrlUser.getID);
router.put('/users/:id', jwtHelper.verifyJwtToken, ctrlUser.put);
// router.put('/userspermission/:id', ctrlUser.putLoginPermission);
router.delete('/users/:id', jwtHelper.verifyJwtToken, ctrlUser.delete);

// Member => localhost:3000/api/.......


// Admin
router.get('/user/memberscountall', jwtHelper.verifyJwtToken, ctrlMember.getAllCount);
router.get('/user/malememberscountall', jwtHelper.verifyJwtToken, ctrlMember.getAllMaleCount);
router.get('/user/femalememberscountall', jwtHelper.verifyJwtToken, ctrlMember.getAllFemaleCount);


// Members
router.post('/user/members/register', jwtHelper.verifyJwtToken, ctrlMember.register);
router.post('/user/members/sms', ctrlMember.sendSms);
router.post('/user/members/uploadExcel', jwtHelper.verifyJwtToken, ctrlMember.uploadExcel);
router.get('/user/members', jwtHelper.verifyJwtToken, ctrlMember.get);
router.get('/user/memberscount/:classname', jwtHelper.verifyJwtToken, ctrlMember.getCount);
router.get('/user/malemembers/:classname', jwtHelper.verifyJwtToken, ctrlMember.getMale);
router.get('/user/femalemembers/:classname', jwtHelper.verifyJwtToken, ctrlMember.getFemale);
router.get('/user/members/:id', jwtHelper.verifyJwtToken, ctrlMember.getID);
router.get('/user/members/classname/:classname', jwtHelper.verifyJwtToken, ctrlMember.getClassname);
router.put('/user/members/:id', jwtHelper.verifyJwtToken, ctrlMember.put);
router.delete('/user/members/:id', jwtHelper.verifyJwtToken, ctrlMember.delete);

/////////////////////////////////////////////////////////////////

// Dues => localhost:3000/api/.......
router.post('/user/dues/register', jwtHelper.verifyJwtToken, ctrlDues.register);
router.post('/user/dues/uploadExcel', jwtHelper.verifyJwtToken, ctrlDues.uploadExcel);
router.get('/user/dues', jwtHelper.verifyJwtToken, ctrlDues.get);
router.get('/user/dues/:id', jwtHelper.verifyJwtToken, ctrlDues.getID);
router.get('/user/duescount', jwtHelper.verifyJwtToken, ctrlDues.getCount);
router.get('/user/dues/classname/:classname', jwtHelper.verifyJwtToken, ctrlDues.getClassname);
router.get('/user/dues/total/:classname', jwtHelper.verifyJwtToken, ctrlDues.getSum);
router.get('/user/duesalltotal', jwtHelper.verifyJwtToken, ctrlDues.getAllSum);
router.get('/user/alldatafilter/:startdate/:enddate', jwtHelper.verifyJwtToken, ctrlDues.getAllDateFilter);
router.put('/user/dues/:id', jwtHelper.verifyJwtToken, ctrlDues.put);
router.delete('/user/dues/:id', jwtHelper.verifyJwtToken, ctrlDues.delete);

// Attendance => localhost:3000/api/.......
router.post('/user/attendance/register', jwtHelper.verifyJwtToken, ctrlAttendance.register);
router.post('/user/attendance/uploadExcel', jwtHelper.verifyJwtToken, ctrlAttendance.uploadExcel);
router.get('/user/attendance', jwtHelper.verifyJwtToken, ctrlAttendance.get);
router.get('/user/attendance/:id', jwtHelper.verifyJwtToken, ctrlAttendance.getID);
router.get('/user/attendancecount/:classname', jwtHelper.verifyJwtToken, ctrlAttendance.getCount);
router.get('/user/allattendancecount', jwtHelper.verifyJwtToken, ctrlAttendance.getAllCount);
router.get('/user/allattendance/present/:classname', jwtHelper.verifyJwtToken, ctrlAttendance.getAllPresentCount);
router.get('/user/allattendance/absent/:classname', jwtHelper.verifyJwtToken, ctrlAttendance.getAllAbsentCount);
router.get('/user/allattendancedatefilter/:startdate/:enddate', jwtHelper.verifyJwtToken, ctrlAttendance.getAllAttendanceDateFilter);
router.get('/user/attendance/classname/:classname', jwtHelper.verifyJwtToken, ctrlAttendance.getClassname);
router.put('/user/attendance/:id', jwtHelper.verifyJwtToken, ctrlAttendance.put);
router.delete('/user/attendance/:id', jwtHelper.verifyJwtToken, ctrlAttendance.delete);

// Payments => localhost:3000/api/.......
router.post('/user/payment/register', jwtHelper.verifyJwtToken, ctrlPayment.register);
router.get('/user/payment', jwtHelper.verifyJwtToken, ctrlPayment.get);
router.get('/user/payment/allpaymentcount', jwtHelper.verifyJwtToken, ctrlPayment.getAllCount);
router.get('/user/filter/payment/:startdate/:enddate', jwtHelper.verifyJwtToken, ctrlPayment.getAllPaymentDateFilter);
router.get('/user/payment/:id', jwtHelper.verifyJwtToken, ctrlPayment.getID);
router.get('/user/payment/user/:id', jwtHelper.verifyJwtToken, ctrlPayment.getUserID);
router.get('/user/payments/summary/daily', jwtHelper.verifyJwtToken, ctrlPayment.getSummaryDaily);
router.get('/user/payments/summary/monthly', jwtHelper.verifyJwtToken, ctrlPayment.getSummaryMonthly);
router.get('/user/payments/summary/yearly', jwtHelper.verifyJwtToken, ctrlPayment.getSummaryYearly);
router.put('/user/payment/:id', jwtHelper.verifyJwtToken, ctrlPayment.put);

// Task => localhost:3000/api/.......
router.post('/user/task/register', jwtHelper.verifyJwtToken, ctrlTask.register);
router.get('/user/task', jwtHelper.verifyJwtToken, ctrlTask.get);
router.get('/user/task/:id', jwtHelper.verifyJwtToken, ctrlTask.getID);
router.get('/user/taskcount/:classname', jwtHelper.verifyJwtToken, ctrlTask.getCount);
router.get('/user/alltaskcount', jwtHelper.verifyJwtToken, ctrlTask.getAllCount);
router.get('/user/task/classname/:classname', jwtHelper.verifyJwtToken, ctrlTask.getClassname);
router.get('/user/task/:startdate/:enddate', jwtHelper.verifyJwtToken, ctrlTask.getAllTaskDateFilter);
router.put('/user/task/:id', jwtHelper.verifyJwtToken, ctrlTask.put);
router.delete('/user/task/:id', jwtHelper.verifyJwtToken, ctrlTask.delete);

// Plan => localhost:3000/api/.......
router.post('/plan/register', jwtHelper.verifyJwtToken, ctrlPlan.register);
router.get('/plan', jwtHelper.verifyJwtToken, ctrlPlan.get);
router.get('/plan/doc/:name', jwtHelper.verifyJwtToken, ctrlPlan.getByName);
router.get('/plan/:id', jwtHelper.verifyJwtToken, ctrlPlan.getID);
router.get('/allplancount', jwtHelper.verifyJwtToken, ctrlPlan.getCount);
router.put('/plan/:id', jwtHelper.verifyJwtToken, ctrlPlan.put);
router.delete('/plan/:id', jwtHelper.verifyJwtToken, ctrlPlan.delete);

// Subscription => localhost:3000/api/.......
router.post('/subscription/register', jwtHelper.verifyJwtToken, ctrlSubscription.register);
router.get('/subscriptions', jwtHelper.verifyJwtToken, ctrlSubscription.get);
router.get('/subscription/:id', jwtHelper.verifyJwtToken, ctrlSubscription.getID);
router.get('/allsubscriptioncount', jwtHelper.verifyJwtToken, ctrlSubscription.getCount);
router.get('/subscription/:startdate/:enddate', jwtHelper.verifyJwtToken, ctrlSubscription.getAllSubscriptionDateFilter);
router.put('/subscription/:id', jwtHelper.verifyJwtToken, ctrlSubscription.put);
// router.delete('/plan/:id', jwtHelper.verifyJwtToken, ctrlSubscription.delete);




module.exports = router;