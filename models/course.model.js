const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'name field is required',
        unique: true,
        minlength: 3
    },
    active:{
        type:Boolean,
        default:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Category'
    },
    duration :{
        type:Number,
        required:'duration field is required'
    }
},{ versionKey: false, timestamps : { createdAt : 'created_at', updatedAt : 'updated_at' } });

const Course = new mongoose.model('Course', CourseSchema);
module.exports = Course;