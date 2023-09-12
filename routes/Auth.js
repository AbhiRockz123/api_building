const express = require('express');
const router = express.Router();
//import our Authentication Controller method and passing it to our route method
const { RegisterUser, checkUserLoginCredentials, getUserDetails, forgotPassword, resetPassword, updateEmailandPassword, updatePassword , logoutUser } = require("../controllers/Auth")

//import our Protect Middd\leware which will check that only user which are logged in and and have access to modify the course can do so
const { protect, authorize } = require('../middleware/auth');

router.post('/register',RegisterUser)
router.post('/login',checkUserLoginCredentials)
router.get('/me',protect, authorize('admin', 'publisher'), getUserDetails)
router.get('/logout',protect, logoutUser )
router.post('/forgotpassword',forgotPassword)
router.put('/resetPassword/:resetToken',resetPassword)
router.put('/updateDetails',protect, updateEmailandPassword)
router.put('/updatePassword', protect, updatePassword)

module.exports = router;


