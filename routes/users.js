const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Users = require('../models/Users');
//import our Authentication Controller method and passing it to our route method
const { getUsers, getSingleUser, createUser, updateUser, deleteUser } = require("../controllers/users")

//import our Protect Middd\leware which will check that only user which are logged in and and have access to modify the course can do so
const { protect, authorize } = require('../middleware/auth');


router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(advancedResults(Users), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports = router;