const usermodel = require('../models/User.model');
const userService = require('../services/user.service');
const blacklistToken = require('../models/blacklistToken.model');

const { validationResult } = require('express-validator');


  module.exports.registerUser = async (req,res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {fullname, email, password} = req.body;

    const hashedPassword = await usermodel.haspassword(password);
    const newUser = await userService.createUser({
        fullname:{
            firstname:fullname.firstname, 
        lastname: fullname.lastname, 
        },
        email, 
        password: hashedPassword
    });
    await newUser.save();
    const token = newUser.generateAuthToken();
    res.cookie('token', token,)
    res.status(201).json({ token, newUser});

   }


    module.exports.loginUser = async(req, res, next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        console.log( req.body );
        const {email, password} = req.body;
        const user = await usermodel.findOne({email}).select('+password');
        if(!user){
            return res.status(401).json({message:'Invalid email or password'});

        }
        console.log(user);
        const isMatch  = await user.comparePassword(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid email or password'});
        }
        const token = user.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, user });

    }
    
  module.exports.getUserProfile = async(req, res, next) =>{
   res.status(200).json({user: req.user});
  }

 module.exports.logoutUser = async(req, res, next) =>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split('')[1];
    if(token) {
        await blacklistToken.create({ token });
    }
    res.status(200).json({message: 'User logged out successfully'});

 }


    




