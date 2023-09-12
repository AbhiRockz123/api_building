const express = require('express');
const Bootcamp = require('../models/bootcamps');
const ErrorResponse = require('../routes/utils/errorclass');
const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const mongoSanitizer = require('express-mongo-sanitize');
const sendEmail = require('../routes/utils/sendEmail');
const crypto = require('crypto');


// @desc      Register new user in our Bootcamp
// @route     POST /api/v1/auth/register
// @access    Public

exports.RegisterUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const userData = await User.create({ name, email, password, role });
  //console.log(userData);

  //create Token

  const token = userData.getSignedWebToken();

  res.status(200).json({
    success: true,
    userData: userData,
    token: token
  })
})


// @desc      login User and authenticate with password and email credentials
// @route     POST /api/v1/auth/login
// @access    Public

exports.checkUserLoginCredentials = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(("Please provide a valid email and password"), 401))
  }
  const user = await User.findOne({ email }).select('password');
  //check if user exists in the database
  if (!user) {
    return next(new ErrorResponse(('invalid credentials'), 401))
  }
  console.log(password);

  const check = await user.matchPassword(password);

  //check if password entereed by user is correct
  if (!check) {
    return next(new ErrorResponse(('invalid credentials'), 401))
  }
  // return token
  sendTokenResponse(user, 200, res);
})


// @desc      checks the logged in user and fetch the details corresponding to the user
// @route     POST /api/v1/auth/me
// @access    Private

exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(("Please provide a valid email and password"), 401))
  }
  const user = await User.find({ email: email })
  //check if user exists in the database
  if (!user) {
    return next(new ErrorResponse(('invalid credentials'), 401))
  }

  // return token
  res.status(200).json({
    success: true,
    userData: user
  })

})


// @desc      checks the logged in user and fetch the details corresponding to the user
// @route     POST /api/v1/auth/logout
// @access    Private

exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token','none',{
    expires:new Date(Date.now()+10*1000),
    httpOnly:true,
  })
  // return token
  res.status(200).json({
    success: true, 
    data:{},
  })

})

// @desc      Update the email and Name for particular user 
// @route     PUT  /api/v1/auth/updateDetails
// @access    Private

exports.updateEmailandPassword = asyncHandler(async (req, res, next) => {

  // get the fields that needs to be updated
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }
  const user = await User.findByIdAndUpdate((req.user)[0]._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse(('invalid credentials'), 401))
  }

  // return token
  sendTokenResponse(user, 200, res);
})

// @desc      Update Password for particular user 
// @route     PUT  /api/v1/auth/updatePassword
// @access    Private

exports.updatePassword = asyncHandler(async (req, res, next) => {


  console.log(fieldsToUpdate)
  const user = await User.findOne({ _id: (req.user)[0]._id }).select('+password');
  if (!user) {
    return next(new ErrorResponse(('invalid credentials'), 401))
  }
  console.log(user)
  const currentpassword = req.body.currentPassword
  console.log(currentpassword)
  const check = await user.matchPassword(currentpassword);
  console.log(check)

  //check if password entered by user is correct
  if (!check) {
    return next(new ErrorResponse(('invalid credentials'), 401))
  }

  user.password = req.body.newPassword;
  await user.save();
  // return token
  sendTokenResponse(user, 200, res);
})


// @desc      Forgot Password 
// @route     POST /api/v1/auth/forgotpassword
// @access    Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
  Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});



// @desc      Resets the password via the forgot password URL generated 
// @route     PUT /api/v1/auth/resetPassword/:resetToken
// @access    Public

exports.resetPassword = asyncHandler(async (req, res, next) => {

  const token_details = req.params.resetToken;
  // console.log(token_details);

  //decrypt the forgot password token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token_details)
    .digest('hex');
  // console.log(resetPasswordToken);

  // check if the user exists and the password expiry is greater than or equal to the current time
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  // console.log(user)

  //send error message
  if (!user) {
    return next(new ErrorResponse(("Invalid Credentials"), 404));
  }

  // update the password field 
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // generate and  return user session token
  sendTokenResponse(user, 200, res)

})

//function that takes the statusCode , user instance (info) and response object that will send the  response to our client with appropriate status
//data 

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedWebToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY_DURATION * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    User: user,
    token,
  });
};