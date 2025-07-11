const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type: String,
            required:[true, 'First name is required'] ,
            minlength:3,
        },
        lastname:{
            type: String,
            
        }
    },
    email:{
        type: String,
        required:[true, 'Email is required']
    },
    password :{
        type: String,
        required:[true, 'Password is required'],
        minlength:6,
        select: false // Exclude password from queries by default
    },
    socketId:{
        type: String,
    }
},{timestamps:true,});



userSchema.methods.generateAuthToken = function() {
   const token = Jwt.sign({id: this._id}, process.env.JWT_SECRET,{expiresIn: '1d'});
   return token;
};

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.haspassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

module.exports = mongoose.model('User', userSchema);