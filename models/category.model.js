const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'name field is required',
        unique: true
    },
    active:{
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps :{ createdAt : 'created_at', updatedAt : 'updated_at' }});


const Category = new mongoose.model('Category', categorySchema);

module.exports = Category;