const captainModel = require('../models/captain.model.js');
const captainService = require('../services/captain.service.js');
const { validationResult } = require('express-validator');

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

   const token = newCaptain.generateAuthToken();
    
    res.cookie('token', token);
    res.status(201).json({ token, newCaptain });
}
