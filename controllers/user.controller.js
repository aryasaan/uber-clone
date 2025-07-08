const usermodel = require('../models/User.model');
const userService = require('../services/user.service');
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


    const token = newUser.generateAuthToken();
    res.status(201).json({ token, newUser});


}




