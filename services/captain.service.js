const captainModel = require('../models/captain.model.js');


module.exports.registerCaptain = async({firstname, lastname, email, password, color,plate,capacity, vehicleType})=>{
    if(!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    
    const newCaptain = new captainModel({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            type: vehicleType
        }
    });
    
    return newCaptain;
}