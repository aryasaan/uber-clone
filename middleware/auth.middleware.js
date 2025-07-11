const userModel = require('../models/User.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistToken= require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) =>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Unauthorized access, please login first'});

    }

    const isblacklisted = await  blacklistToken.findOne({token: token});
    if(isblacklisted){
        return res.status(401).json({message: 'Token is blacklisted, please login again'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({message: 'User not found, please register first'});
        }
        req.user = user;
       return next();
        
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}