const mongoose = require('mongoose');

userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 3
    },
    email: {
        type : String,
        required : true,
        unique:[ true, 'email should be unique']
    },
    phone:{
        type : String,
        required : true,
        minlength:10
    },
    password:{
        type : String,
        required : true
    },
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const User = new mongoose.model('User', userSchema);
module.exports = User;