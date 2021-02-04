const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');

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
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tokens :[{ 
        token : {
            type : String,
            required : true
        } 
    }]
},{ versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


userSchema.methods.generateAuthToken = async function(){
    try {
        const jwtToken = await jwt.sign({ _id: this._id }, config.secret_key);
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