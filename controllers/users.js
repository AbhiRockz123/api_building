const express = require('express');
const ErrorResponse = require('../routes/utils/errorclass');
const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const advancedResults = require('../middleware/advancedResults');

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/admin

exports.getUsers = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

})


// @desc    Get single user details
// @route   GET /api/v1/auth/users/:id
// @access  Private/admin

exports.getSingleUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorResponse(("User not found"),401))
    }
    res.status(200).json({
        success: true,
        UserDetails: user,

    })
})

// @desc      Create new user 
// @route     POST /api/v1/auth/users
// @access    Private/admin

exports.createUser= asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body)
    res.status(200).json({
        success: true,
        UserDetails: user,
        message: 'User Successfully created',
    })
})

// @desc      Update user by ID
// @route     PUT /api/v1/auth/users/:id
// @access    Private/admin

exports.updateUser= asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators:true,
    })
    if(!user){
        return next(new ErrorResponse(("User not found"),401))
    }
    res.status(200).json({
        success: true,
        UserDetails: user,
        message: 'User  Updated Successfully ',
    })
})

// @desc      Delete user by ID
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/admin

exports.deleteUser= asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new ErrorResponse(("User not found"),401))
    }
    res.status(200).json({
        success: true,
        UserDetails: user,
        message: 'User  Deleted  Successfully ',
    })
})


