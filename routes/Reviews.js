const express = require('express');
const { getReviews, getReview, addReview , updateReview, deleteReview } = require('../controllers/Reviews.js');
const advancedResults = require('../middleware/advancedResults');
//merge our params 
const router = express.Router({ mergeParams: true });
const Reviews = require('../models/Reviews');
//import our Protect Middleware which will check that only user which are logged in and and have access to modify the course can do so
const { protect, authorize } = require('../middleware/auth');


router.route('/')
    .get(advancedResults(Reviews, {
        path: 'bootcamp',
        select: 'name description',
    }), getReviews)
    .post(protect, authorize('admin', 'user'), addReview)

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('admin', 'user'), updateReview)
    .delete(protect,authorize('admin','user'),deleteReview);

module.exports = router;