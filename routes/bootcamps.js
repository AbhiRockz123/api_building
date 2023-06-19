const express = require('express');
const { getBootCamp,
    getBootCamps,
    updateBootCamp,
    deleteBootCamp,
    createBootCamp,
    createBootCamps
} = require('../controllers/bootcamps');
const router = express.Router();

router.route('/')
    .get(getBootCamps)
    .post(createBootCamps)

router.route('/:id')
    .get(getBootCamp)
    .put(createBootCamp)
    .delete(deleteBootCamp)
    .post(createBootCamp);

module.exports = router;