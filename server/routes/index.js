var express                  = require('express');
var router                   = express.Router();
var models                   = require('../models/index');
var userController           =  require('./../controllers/userController');
var correspondenceController =  require('./../controllers/correspondenceController');
var enrollmentController     =  require('./../controllers/enrollmentController');
var pcpController            =  require('./../controllers/pcpController');
var programTypeController    =  require('./../controllers/programTypeController');
var claimsDataController    =  require('./../controllers/claimsDataController');
var claimsDetailsController    =  require('./../controllers/claimsDetailsController');

router.get('/', function(req, res, next) {
  res.render('login.ejs', { title: 'Express', msg:""});
});

router.get('/fetchCorrespondence', correspondenceController.fetchCorrespondence);
router.get('/correspondenceType', correspondenceController.fetchCorrespondenceType);
router.get('/deleteCorrespondence/:id', correspondenceController.deleteCorrespondence);
router.post('/update_Correspondence', correspondenceController.updateCorrespondence);


router.get('/getEnrollments', enrollmentController.fetchEnrollment);
router.post('/updateEnrollment', enrollmentController.updateEnrollment);
router.get('/deleteEnrollment/:id', enrollmentController.deleteEnrollmentById);


router.get('/assignPCP', pcpController.fetchAssignPCP);
router.get('/userAssignPCP/:id', pcpController.fetchAssignPCPByUser);
router.get('/getPcp', pcpController.fetchPCP);
router.post('/updatePCP', pcpController.updatePCP);
router.get('/deletePCP/:id', pcpController.deletePCP);



router.get('/programType/:id', programTypeController.fetchProgram);
router.post('/programModel', programTypeController.saveProgram);
router.delete('/program/:id', programTypeController.deleteProgram);
router.patch('/updateProgram/:id', programTypeController.updateProgram);


router.post('/', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/getUser/:id', userController.fetchUser);
router.get('/getUserById/:id', userController.getUserById);
router.get('/getUsersDropDown', userController.getUsers);
router.get('/getUsersData', userController.getUsersData);
router.get('/getUserPcp/:id', userController.getUserPcp);
router.get('/getUserEligibility/:id', userController.getUserEligibility);
router.get('/getUserCorrespondence/:id', userController.getUserCorrespondence);
router.get('/deleteUserById/:id', userController.deleteUserById);
router.post('/updateUser', userController.updateUser);
router.get('/userHome', userController.userHome);


router.get('/getClaimsData',claimsDataController.getClaimsData)



router.post('/claimsDetails',  claimsDetailsController.saveClaimsDetails)
router.get('/fetchUserClaimDetails/:id',  claimsDetailsController.fetchClaimDetails)
router.get('/getClaimDetails/:id',  claimsDetailsController.getClaimDetailsByMonth)



module.exports = router;
