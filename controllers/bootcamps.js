const express = require('express');
const router = express.Router();



exports.getBootCamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: 'show bootcamps details',
    });
};
exports.getBootCamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `show bootcamps details with ${req.params.id}`,
    });
};

exports.updateBootCamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `the bootcamp id is ${req.params.id}`,
    });
};

exports.deleteBootCamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `Updating  bootcamp  with id :- ${req.params.id}`,
    });
};
exports.createBootCamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `creating new bootcamp  with id :- ${req.params.id}`,
    });
};
exports.createBootCamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `creating new bootcamp `,
    });
};



