const Category = require("../models/category");

const findDocument = async(req, res)=>{
    try {
        const result = await Category.find();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createDocument = async(req, res)=>{
    try {
        const result = await Category(req.body).save();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}
const updateDocument = async(req, res)=>{
    try {
        const result = await Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}
const deleteDocument = async(req, res)=>{
    try {
        const result = await Category.findByIdAndDelete({ _id: req.params.id });
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}


module.exports = { findDocument, createDocument, updateDocument, deleteDocument };