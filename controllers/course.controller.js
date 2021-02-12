const Course = require('../models/course.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

const findDocuments = async (req, res, next) => {
    try {
        await Course.find()
        .populate({ path: 'category' })
        .exec((err, data)=>{
            if (err) { return next(createError(400, err.message)); };
            res.status(200).send(data); 
        });
    } catch (error) {
        next(error);
    }
}

const findDocumentById = async (req, res, next) => {
    try {
        const result = await Course.findById(req.params.id).populate({ path: 'category' }).exec();
        if(!result) { 
            throw createError(404, 'User does not exist.');
        }
        res.status(200).send(result);
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            return next(createError(400, 'Invalid User id'));
        }
        next(error);
    }
}

const createDocument = async (req, res, next) => {
    try {
       const course = await new Course(req.body).save(); 
       res.status(201).json({success : true, message : 'Course Created Successfully', data : course });
    } catch (error) {
        if (error.name === 'ValidationError') { return next(createError(422, error.message)); }
        next(error);
    }
}

module.exports = { findDocuments, findDocumentById, createDocument };