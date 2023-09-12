const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../routes/utils/errorclass');
const user = require('../models/Users')
const dotenv = require('dotenv');
const User = require('../models/Users');

dotenv.config({ path: "./config/config.env" })

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }

  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  //console.log(token);

  if (!token) {

    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  //console.log('after checking token');

  try {
    // Verify token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    //req.user is an object that holds the user data corresponding to the authenticated user.
    // The user data is obtained by decoding the JWT token,
    // and it allows other parts of the application to access user-specific information 
    //for further processing or authorization checks.
    req.user = await User.find({ _id: decoded.id })
    console.log(req.user) 
   
   
    next();
  } catch (err) {

    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// to check that only authorized roles can modify the DB 

exports.authorize = (...roles) => {
  return  async (req, res, next) => {
    console.log(req.user);
  
    if(!req.user)
    {
      req.user = await User.find({ _id: decoded.id })
    }
    if (!roles.includes((req.user)[0].role)){ // if the provides roles is not defined to support the DB alter kind
      return next(new ErrorResponse((`Role ${(req.user)[0].role} cannot perform this action`),403));
    }
    next();
    
  }
  
}


