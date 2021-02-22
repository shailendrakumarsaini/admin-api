const User = require("../models/user.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const createError = require('http-errors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: config.EMAIL.USERNAME,
        pass: config.EMAIL.PASSWORD
    }
});

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
        const userObj = new User(req.body);
        // const token = await user.generateAuthToken();
        // res.cookie('jwt', token, 
        //     // { 
        //     //     expires: new Date(Date.now() + 5000 ), // add expiry time
        //     //     httponly: true, // client can't modify if true
        //     //     // secure: true // make true for https connection
        //     // }
        //     );
        if(req.file){
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            userObj.image = result.secure_url;
        }
        const user = await userObj.save();
        console.log('config=>',config);
        if(user){
            var verificationLink = `${config.DOMAIN}/user/verification?email=${user.email}`;
            var mailOptions = {
                to: 'sainishailendra1996@gmail.com',
                subject: 'Welcome greeting from Osteen',
                html: `<p> Hello  ${user.name}  !</p> \n <p>Your login details as below. </p> \n <p> UserName:  ${ user.email} </p> \n <p> Password:  ${req.body.password} </p> \n
                        <p> Please complete you verification by clicking on the link:  ${verificationLink} </p> \n`
            }
            console.log('auth',{auth: {
                user: config.EMAIL.USERNAME,
                pass: config.EMAIL.PASSWORD
            }});
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    res.status(400).json({ success : false, message: 'Invalid User Logins For Sending Email' });
                } else {
                    res.status(201).json({ success : true, message: 'User Created Successfully', data : user });
                }
            });
        }
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(createError(422, error.message));
        }
        next(error); 
    }
}

const updateDocument = async (req, res, next)=>{
    try {
        if(req.file){
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            req.body.image = result.secure_url;
        }
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

const verification = async (req, res, next) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({ email: email });
        if(user){
            const result  = await User.update({ _id: user._id }, { is_active : true });
            res.send('Your Email Verified Successfully. Please login');
        }else{
            throw createError(404, 'User does not exist.'); 
        }
        
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
            if(!user.is_active){
                res.status(400).json({success : false, message: 'Email not yet Verified'});
            }else{
                const isMatch = await bcrypt.compare(req.body.password, user.password);
                if(isMatch){
                    const token = await user.generateAuthToken();
                    // res.cookie('jwt', token, 
                    //     { 
                    //         expires: new Date(Date.now() + 50000 ), // add expiry time
                    //         httponly: true, // client can't modify if true
                    //         // Domain:'http://localhost:4200',
                    //         // Path:'/',
                    //         // visited: true
                    //         // secure: true // make true for https connection
                    //     }
                    // );
                    res.status(200).json({success : true, token, message: 'login successfully'});
                }else{
                    res.status(400).json({success : false, message: 'Password Mismatch'});
                }
            }
        }else{
            throw createError(400, 'Invalid Email');
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
        // res.clearCookie('jwt');
        await req.user.save();
        res.status(200).json({success : true, message: 'Logout successfully'});
    } catch (error) {
        next(error);
    }
}

const logoutall = async (req, res, next) => {
    try {
        req.user.tokens = [];
        // res.clearCookie('jwt');
        await req.user.save();
        res.status(200).json({success : true, message: 'Logout successfully from all devices'});
    } catch (error) {
        next(error);
    }
}

const uploadImage = async (req, res, next)=>{
    try {
        console.log(req.file);
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}


module.exports = { 
    findDocument, 
    findDocumentById, 
    createDocument, 
    updateDocument, 
    deleteDocument, 
    verification,
    login, 
    logout, 
    logoutall, 
    uploadImage 
}