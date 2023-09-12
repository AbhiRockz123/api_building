const express = require('express');
const { getBootCamp,
    getBootCamps,
    updateBootCamp,
    deleteBootCamp,
    createBootCamp,
    createBootCamps,
    getBootCampByRadius,
    uploadPhotoToBootcamp
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/bootcamps')
const courseRouter = require('./courses');
const router = express.Router();
const reviewRouter = require('../routes/Reviews');
const advancedResults = require('../middleware/advancedResults');

// we can nest routers by attaching them as middleware and whatever we add will be merged with the route already existing
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/Reviews', reviewRouter);

//import our Protect Middleware which will check that only user which are logged in and and have access to modify the course can do so
const { protect, authorize } = require('../middleware/auth');

router.route('/radius/:zipcode/:distance')
    .get(getBootCampByRadius)

router.route('/')
    .get(advancedResults(Bootcamp), getBootCamps)
    .post(protect, authorize('admin', 'publisher'), createBootCamps)

router.route('/:id/photo')
    .put(protect, authorize('admin', 'publisher'), uploadPhotoToBootcamp)

router.route('/:id')
    .get(getBootCamp)
    .put(protect, authorize('admin', 'publisher'), updateBootCamp)
    .delete(protect, authorize('admin', 'publisher'), deleteBootCamp)
    .post(protect, authorize('admin', 'publisher'), createBootCamp);

module.exports = router;