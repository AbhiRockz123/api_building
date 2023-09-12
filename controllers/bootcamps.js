const express = require('express');
const Bootcamp = require('../models/bootcamps');
const asyncHandler = require('../middleware/async');
const geocoder = require('../routes/utils/Geocode');
const ErrorResponse = require('../routes/utils/errorclass');
const dotenv=require('dotenv');
const path = require('path');
const advancedResults=require('../middleware/advancedResults');

// dotenv.config({path:'../config/config.env'})

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public

exports.getBootCamps = asyncHandler(async (req, res, next) => {
    
res.status(200).json(res.advancedResults)
});


// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public

exports.getBootCamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find({_id:req.params.id})
    if (!bootcamp) { 
        return next(new ErrorResponse(`Error is due to unmatched Bootcamp id ${req.params.id}`), 404);
    }
    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp,

    });

});


exports.updateBootCamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== (req.user)[0].id && (req.user)[0].role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${(req.user)[0].id} is not authorized to update this bootcamp`,
          401
        )
      );
    }
    
  
  
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find({_id: req.params.id});
    if (!bootcamp) {
        return next(new newErrorResponse(`Error is due to unmatched Bootcamp id ${req.params.id}`), 404);
    }
    await Bootcamp.deleteOne({_id: req.params.id});
    res.status(200).json({
        deleteSuccess: true,
        data: bootcamp
    });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootCampByRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    const loc = await geocoder.geocode(zipcode); // will return the location GeoJSON object with all the fields like latitude, longitude,zipcode,city ,country etc...
    const lat = loc[0].latitude;
    const lon = loc[0].longitude;
    const radius = distance / 6371; //calculate radius of the earth in  km radians
    const bootcamp = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lon, lat], radius] }
        }
    });
    if (!bootcamp) {
        return res.status(404).json({ success: false, data: "data not found" });
    }
    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });
});
exports.createBootCamp = asyncHandler(async (req, res, next) => {

    
    //we will assign the field "user" in our bootcamp model in accordance with the user who altered  it  

    req.body.user=(req.user)[0].id;// req.user is getting fetched the protect and authorize middleware which will have the
    // user instance from where we will fetch the id who created it.

    const publishBootcamp = await Bootcamp.findOne({user:(req.user)[0].id});
    console.log('found bootcamp controller');
    if(publishBootcamp && req.user.role==='publisher' ){
         return next (new ErrorResponse((`${req.user.role} can not be publish another Bootcamp , only admins have such permissions`),403))

    }
    const bootcamp = await Bootcamp.create(req.body);
    if (!bootcamp) {
        return res.status(404).json({ success: false, data: "data not found" });
    }
    res.status(201).json({ success: true, data: bootcamp })
});
exports.createBootCamps = asyncHandler(async (req, res, next) => {
   
     //we will assign the field "user" in our bootcamp model in accordance with the user who altered  it    
     req.body.user=(req.user)[0].id;
     // req.user is getting fetched the protect and authorize middleware which will have the
     // user instance from where we will fetch the id who created it.
 
     const publishBootcamp = await Bootcamp.find({user:(req.user)[0].id});
     if((publishBootcamp).length>=1 && (req.user)[0].role==='publisher' ){
          return next (new ErrorResponse((`${(req.user)[0].role} can not  publish another Bootcamp , only admins have such permissions`),403))
 
     }

     
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

// @desc upload photo in our bootcamp
//@url PUT /api/v1/bootcamps/:id/photo
//@type Private
exports.uploadPhotoToBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next (new ErrorResponse((`Bootcamp not found with id ${req.params.id}`),400));
    }
    const file=req.files.File;
    

    //check if the files were uploaded or not
    if(!file){
        return next(new ErrorResponse(`Please upload the files `,400)) ;
    }

    //check if uploaded file is an image
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload the image file `,400)) ;
    }

    //check if uploaded file is within the bounds of the size of the maximum allowed limit for the image
    if(file.size>process.env.IMAGE_MAX_SIZE)
    {
        return next(new ErrorResponse(`Please upload the files within 1 MB size `,400)) ;
    }

    //create custom file name of our file
    const fileName = `photo_${req.params.id}${path.extname(file.name)}` ;

    //move the image file to be saved to a particular folder location

    file.mv(`${process.env.PHOTO_UPLOAD_LOCATION}/${fileName}`, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }
         //return res.send({ status: "success", path: `${__dirname}/${process.env.PHOTO_UPLOAD_LOCATION}`});
      
      await Bootcamp.findByIdAndUpdate(req.params.id, {
        photo:fileName
      })

      res.status(200).json({success:true,data:fileName});

    });

    

    

    
});


