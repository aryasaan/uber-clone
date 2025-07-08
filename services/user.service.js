const usermodel = require('../models/User.model');

module.exports.createUser = async({fullname, lastname, email, password}) =>{
     if(!fullname || !email || !password) {
        throw new Error('All fields are required')
     }
     const newUser = new usermodel({
        fullname:{
            firstname :fullname.firstname,
            lastname:fullname.lastname,
        },
        email,
        password
     })
     return newUser
}