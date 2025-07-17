const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required: [true, 'first name is required'],
            minLength:[3, 'first name must be at least 3 characters long']
        },
        lastname:{
            type:String,
            minLength:[3, 'last name must be at least 3 characters long']
        }
    },
    email:{
        type:String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        required: [true, 'password is required'],
        select:false,
    },
    sockeqtId:{
        type:String,
        default: null
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required: true,
            minLength:3,
        },
        plate:{
            type:String,
            required: true,
            minLength:3,
        },
        capacity:{
            type:Number,
            required: true,
            min:1,
            max: 6
        },
        type:{
            type:String,
            required: true,
            enum: ['car', 'bike', 'auto'],
            default: 'car'
        }
    },
    lagitude:{
        type:Number, 
        default: null
    },
    longitude:{ 
        type:Number, 
        default: null
    },
    
},{timestamps: true});

captainSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    this.token = token;
    return token;
}
captainSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

captainSchema.statics.hashedPassword = async function(password) {
    if(!password) {
        throw new Error('Password is required');
    }
    return await bcrypt.hash(password, 10); 
}



const captainModel = mongoose.model('Captain', captainSchema);
module.exports = captainModel;

