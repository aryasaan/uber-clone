const captainModel = require('../models/captain.model.js');
const captainService = require('../services/captain.service.js');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerCaptain = async(req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    console.log(req.body);

    const {fullname, email, password, vehicle} = req.body;

    const existingCaptain = await captainModel.findOne({email});
    if(existingCaptain){
        return res.status(400).json({message: 'Captain with this email already exists'});
    }



    const hashedPassword = await captainModel.hashedPassword(password);
    const newCaptain = await captainService.registerCaptain({
        firstname : fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color:vehicle.color,
        plate: vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.type,
    });

   const token = await newCaptain.generateAuthToken();
   await newCaptain.save();
    
    res.cookie('token', token);
    res.status(201).json({ token, newCaptain });
}


module.exports.loginCaptain = async(req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email, password} = req.body;
    const captain = await captainModel.findOne({email}).select('+password');
    if(!captain){
        return res.status(400).json({message: 'Captain with this email does not exist'});

    }
    
    const isMatch = await captain.comparePassword(password);
    
    if(!isMatch){
        return res.status(400).json({message: 'Invalid password'});
    }
    const token = await captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, captain });   



}
module.exports.GetCaptainProfile = async(req, res, next) =>{
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async(req, res, next) =>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}
