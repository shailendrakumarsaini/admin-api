const User = require("../models/user")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const findDocument = async (req, res)=>{
    try {
        await User.find()
        .populate({ path: 'category' })
        // .populate({ path: 'category', select: ['name', 'active', 'created_at'] })
        .exec((err, data)=>{
            if (err) { res.status(400).send(err); };
            res.status(200).send(data);
        });
    } catch (error) {
       res.status(400).send(error); 
    }
}

const findDocumentById = async (req, res)=>{
    try {
        const result = await User.find({ _id : req.params.id});
        res.status(200).send(result);
    } catch (error) {
       res.status(400).send(error); 
    }
}

const createDocument = async (req, res)=>{
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        res.cookie('jwt', token, 
            // { 
            //     expires: new Date(Date.now() + 5000 ), // add expiry time
            //     httponly: true, // client can't modify if true
            //     // secure: true // make true for https connection
            // }
            );
        const result = await user.save();
        res.status(201).send(result);
    } catch (error) {
       res.status(400).send(error); 
    }
}

const updateDocument = async (req, res)=>{
    try {
        const result = await User.findByIdAndUpdate({ _id : req.params.id }, req.body, { new: true });
        res.status(200).send(result);
    } catch (error) {
       res.status(400).send(error); 
    }
}

const deleteDocument = async (req, res)=>{
    try {
        const result = await User.findByIdAndDelete({ _id : req.params.id });
        res.status(200).send(result);
    } catch (error) {
       res.status(400).send(error); 
    }
}

const login = async (req, res)=>{
    try {
        const user = await User.findOne({ email : req.body.email});
        if(user && user.email === req.body.email){
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if(isMatch){
                const token = await user.generateAuthToken();
                res.cookie('jwt', token, 
                // { 
                //     expires: new Date(Date.now() + 5000 ), // add expiry time
                //     httponly: true, // client can't modify if true
                //     // secure: true // make true for https connection
                // }
                );
                res.status(200).send('login successfully');
            }else{
                res.status(400).send('Password Mismatch');
            }
        }else{
            res.status(400).send('Email not found');
        }
    } catch (error) {
       res.status(400).send(error); 
    }
}


module.exports = { findDocument, findDocumentById, createDocument, updateDocument, deleteDocument, login }