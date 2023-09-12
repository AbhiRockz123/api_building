const express = require('express');
const {
    getCourses, getCourse, addCourse, updateCourse, deleteCourse
} = require('../controllers/courses');
const courses = require('../models/courses');
const advancedResults = require('../middleware/advancedResults');

// you need to set mergeParams: true on the router,
// if you want to access params from the parent router

const router = express.Router({ mergeParams: true });

//import our Protect Middd\leware which will check that only user which are logged in and and have access to modify the course can do so
const { protect ,authorize}= require('../middleware/auth');


//import our Protect Middleware which will check that only user which are logged in and and have access to modify the course can do so


//we are fetching merged params rom the parent router //api/v1/bootcamps/:bootcampId/courses
router
    .route('/')
    .get(advancedResults(courses
        , {
            path: 'bootcamp',
            select: 'title tuition'
        }), getCourses)
    .post(protect,authorize('admin','publisher'), addCourse)


//api/v1/course/:id route
router
    .route('/:id')
    .get(getCourse)
    .put(protect,authorize('admin','publisher'),updateCourse)
    .delete(protect,authorize('admin','publisher'),deleteCourse)

module.exports = router;