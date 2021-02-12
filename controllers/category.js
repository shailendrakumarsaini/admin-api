const Category = require("../models/category");
const createError = require('http-errors');
const mongoose = require('mongoose');

const findDocument = async(req, res, next)=>{
    try {
        const category = await Category.find();
        res.send(category);
    } catch (error) {
        next(error);
    }
}

const findDocumentById = async (req, res, next)=>{
    try {
        const category = await Category.findById( req.params.id);
        if(!category){
            throw createError(404, 'Category does not exist.');
        }
        res.send(category);
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            return next(createError(400, 'Invalid Category id'));
        }
        next(error);
    }
}

const createDocument = async(req, res, next)=>{
    try {
        const category = await Category(req.body).save();
        res.status(201).json({ success : true, message: 'Category Created Successfully', data : category });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(createError(422, error.message));
        }
        next(error);
    }
}
const updateDocument = async(req, res, next)=>{
    try {
        const category = await Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if(!category){
            throw createError(404, 'Category does not exist.');
        }
        res.status(200).json({ success : true, message: 'Category Updated Successfully', data : category });
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            return next(createError(400, 'Invalid Category id'));
        }
        next(error);
    }
}
const deleteDocument = async(req, res, next)=>{
    try {
        const category = await Category.findByIdAndDelete({ _id: req.params.id });
        if(!category){
            throw createError(404, 'Category does not exist.');
        }
        res.status(200).json({ success : true, message: 'Category Deleted Successfully', data : category });
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            return next(createError(400, 'Invalid Category id'));
        }
        next(error);
    }
}


module.exports = { findDocument, findDocumentById, createDocument, updateDocument, deleteDocument };