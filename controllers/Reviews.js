const express = require('express');
const Bootcamp = require('../models/bootcamps');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../routes/utils/errorclass');
const Review = require('../models/Reviews');
const advancedResults = require('../middleware/advancedResults')

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public

exports.getReviews = asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId){
        const reviewData = await Bootcamp.find({bootcamp: req.params.bootcampId })
        res.status(200).json({
            success:true,
            count:reviewData.length,
            reviews: reviewData
        })
    }
    else {
        res.status(200).json(res.advancedResults)
    }
});

// @desc      Get single review pertaining to a particular bootcamp
// @route     GET /api/v1/reviews/:id
// @access    Public

exports.getReview = asyncHandler(async (req, res, next) => {
    
    const id = req.params.id;
    const review = await Review.findById(id).populate({ //populate  will add additional  bootcamp field with whatever field  we waana add
        path: 'bootcamp',
        select:'name description',
    })
    if(!review)
    {
        return next(new ErrorResponse(('No review found for the id ' + id), 404))
    }
    res.status(200).json({
        success: true,
        review:review
    })
});

// @desc      Add a review in our Bootcamp DB
// @route     POST /api/v1/bootcamps/:BootcampId/reviews
// @access    Private

exports.addReview = asyncHandler(async (req, res, next) => {
    
    req.body.bootcamp=  req.params.bootcampId;
    req.body.user=(req.user)[0]._id;

    const bootcamp = await Bootcamp.find({_id: req.params.bootcampId});
    if(!bootcamp){
        return next(new ErrorResponse(("Bootcamp not found not found with id " + req.params.bootcampId),404));
    } 

    const reviewData = await Review.create(req.body);

    res.status(200).json({
        success: true,
        review:reviewData,
    })
    
});

// @desc      Update single review pertaining to a particular user
// @route     PUT /api/v1/reviews/:id
// @access    Private

exports.updateReview = asyncHandler(async (req, res, next) => {
    
    let review = await Review.find({_id: req.params.id})
    if(!review)
    {
        return next(new ErrorResponse(('No review found for the id ' + id), 404))
    }
    if(req.user.id === review.user && req.user.role!='publisher'){

        review = await Review.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true,
        })
    }
    else {
        return next(new ErrorResponse(("Either current user is not a publoshet of the review else he is the publisher of the course"),404))
    }

    if(review.user)
    res.status(200).json({
        success: true,
        Review:review
    })
});

// @desc      Delete single review pertaining to a particular user
// @route     DELETE /api/v1/reviews/:id
// @access    Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
    
    let review = await Review.find({_id: req.params.id})
    if(!review)
    {
        return next(new ErrorResponse(('No review found for the id ' + id), 404))
    }

    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
});
});


