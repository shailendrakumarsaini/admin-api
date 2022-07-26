const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../config/config.json");


const auth = async (req, res, next) => {
    try {
        // const userToken = req.cookies.jwt;
        const userToken = req.headers.token;
        // if this token not verified then it will throw error
        const verifyUser = await jwt.verify(userToken, config.SECRET_KEY);
        const user = await User.findOne({_id: verifyUser._id });

        req.token = userToken;
        req.user = user;
  
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;