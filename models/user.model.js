const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');

userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : 'name field is required',
        minlength : 3
    },
    email: {
        type : String,
        required : 'email field is required',
        lowercase: true,
        unique:[ true, 'email should be unique']
    },
    phone:{
        type : String,
        required : 'phone field is required',
        minlength:10,
        maxlength :10
    },
    password:{
        type : String,
        required : 'password field is required',
        minlength: 4
    },
    image:{
        type : String,
        default: null
    },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tokens :[{ 
        token : {
            type : String,
            required : 'token field is required'
        } 
    }],
    is_active :{
        type : Boolean,
        required : 'is_active field is required',
        default : false
    }
},{ versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


userSchema.methods.generateAuthToken = async function(){
    try {
        const jwtToken = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token : jwtToken });
        await this.save();
        return jwtToken;
    } catch (error) {
        res.status(400).send(error);
    }
}

// this function will be call before saving the user and hash the password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = new mongoose.model('User', userSchema);
module.exports = User;