const express = require('express');
const courses = require('../models/courses');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../routes/utils/errorclass');
const bootcamp = require('../models/bootcamps');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = courses.find({ bootcamp: req.params.bootcampId })
    } else {
        query = courses.find();
    }

    //fetch data from course DB asynchronously
    const coursedata = await query;
    res.status(200).json({
        success: true,
        count: coursedata.length,
        data: coursedata
    })


});

// @desc      Get courses by id
// @route     GET /api/v1/courses/:id
// @access    Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await courses.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc      Add courses by id
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public

exports.addCourse = asyncHandler(async (req, res, next) => {
    
    //setting the field users and bootcamp in our course model Document
    req.body.user=(req.user)[0].id;
    req.body.bootcamp = req.params.bootcampId;

    const query = await bootcamp.findById(req.params.bootcampId);// we check if the bootcamp is already  present on our DB , if no such 
    //bootcamp is found we will not create the course as there 
    if (!query) {
        return next(new ErrorResponse((`Course not found with id ${req.params.bootcampId}`), 400));
    }

    if ((query)[0].user.toString() !== (req.user)[0].id && (req.user)[0].role !== 'admin') {
        return next(
          new ErrorResponse(
            `User ${(req.user)[0].id} is not authorized to add a course to  this bootcamp`,
            401
          )
        );
      }
    const courseData = await courses.create(req.body)
    res.status(200).json({
        sucess: true,
        courseData: query,
        postedtoDB: true,
    })
    
});

// @desc      Update courses by id
// @route     PUT /api/v1/courses/:id
// @access    Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let query = await courses.findById(req.params.id);
    if (!query) {
        return next(new ErrorResponse((`Course not found with id ${req.params.id}`), 400));
    }
    if ((query)[0].user.toString() !== (req.user)[0].id && (req.user)[0].role !== 'admin') {
        return next(
          new ErrorResponse(`User ${(req.user)[0].id} is not authorized to update this course`), 401 );
      }
    query = await courses.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,

    })

    res.status(200).json({
        sucess: true,
        courseData: query
    })


});

// @desc      Delete courses by id
// @route     DELETE /api/v1/courses/:id
// @access    Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const query = await courses.find({_id:req.params.id});
    console.log(query);
    if (!query) {
        return next(new ErrorResponse((`Course not found with id ${req.params.id}`), 400));
    }
    if ((query)[0].user.toString()  !== (req.user)[0].id && (req.user)[0].role !== 'admin') {
        return next(
          new ErrorResponse(
            `User ${(req.user)[0].id} is not authorized to delete this course`,
            401
          )
        );
      }

    await courses.deleteOne({ _id: req.params.id })
    res.status(200).json({
        sucess: true,
        courseData: {},
        message: "Course deleted successfully"
    })


});
