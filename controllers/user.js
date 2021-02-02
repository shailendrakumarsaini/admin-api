const User = require("../models/user")

const findDocument = async (req, res)=>{
    try {
        const result = await User.find();
        res.status(200).send(result);
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
        const result = await User(req.body).save();
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


module.exports = { findDocument, findDocumentById, createDocument, updateDocument, deleteDocument }