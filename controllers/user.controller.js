const User = require("../models/user.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const createError = require('http-errors');
const mongoose = require('mongoose');

const findDocument = async (req, res, next)=>{
    try {
        await User.find()
        .populate({ path: 'category' })
        // .populate({ path: 'category', select: ['name', 'active', 'created_at'] })
        .exec((err, data)=>{
            if (err) { res.status(400).send(err.message); };
            res.status(200).send(data);
        });
    } catch (error) {
        next(error);
    }
}

const findDocumentById = async (req, res, next) => {
    try {
        // const result = await User.findOne({ _id : req.params.id});
        const result = await User.findById(req.params.id);

        // if user not exist for that id
        if(!result) { 
            throw createError(404, 'User does not exist.');
        }
        res.status(200).send(result);
    } catch (error) {
        // if id  doesn't exit or id which is not valid mongoose id
        if (error instanceof mongoose.CastError) {
            return next(createError(400, 'Invalid User id'));
        }
        next(error);
    }
}

const createDocument = async (req, res, next)=>{
    try {
        const user = new User(req.body);
        // const token = await user.generateAuthToken();
        // res.cookie('jwt', token, 
        //     // { 
        //     //     expires: new Date(Date.now() + 5000 ), // add expiry time
        //     //     httponly: true, // client can't modify if true
        //     //     // secure: true // make true for https connection
        //     // }
        //     );
        const result = await user.save();
        res.status(201).json({ success : true, message: 'User Created Successfully', data : result });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(createError(422, error.message));
        }
        next(error); 
    }
}

const updateDocument = async (req, res, next)=>{
    try {
        const result = await User.findByIdAndUpdate({ _id : req.params.id }, req.body, { new: true });
        if(!result){
            throw createError(404, 'User does not exist.');
        }
        res.status(200).json({ success : true, message: 'User Updated Successfully', data : result });
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            return next(createError(400, 'Invalid User id'));
        }
        next(error);
    }
}

const deleteDocument = async (req, res, next)=>{
    try {
        const result = await User.findByIdAndDelete({ _id : req.params.id });
        if(!result){
            throw createError(404, 'User does not exist.');
        }
        res.status(200).json({ success : true, message: 'User Deleted Successfully', data : result });
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            return next(createError(400, 'Invalid User id'));
        }
        next(error);
    }
}

const login = async (req, res, next)=>{
    try {
        const user = await User.findOne({ email : req.body.email});
        if(user && user.email === req.body.email){
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if(isMatch){
                const token = await user.generateAuthToken();
                res.cookie('jwt', token, 
                    { 
                        expires: new Date(Date.now() + 50000 ), // add expiry time
                        httponly: true, // client can't modify if true
                        // Domain:'http://localhost:4200',
                        // Path:'/',
                        // visited: true
                        // secure: true // make true for https connection
                    }
                );
                res.status(200).json({success : true, token, message: 'login successfully'});
            }else{
                res.status(400).json({success : false, message: 'Password Mismatch'});
            }
        }else{
            throw createError(400, 'Email not found');
        }
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((element, index, array) =>{
            return element.token != req.token
        });
        res.clearCookie('jwt');
        await req.user.save();
        res.send('logout successfully');
    } catch (error) {
        next(error);
    }
}

const logoutall = async (req, res, next) => {
    try {
        req.user.tokens = [];
        res.clearCookie('jwt');
        await req.user.save();
        res.send('logout successfully from all devices');
    } catch (error) {
        next(error);
    }
}


module.exports = { findDocument, findDocumentById, createDocument, updateDocument, deleteDocument, login, logout, logoutall }