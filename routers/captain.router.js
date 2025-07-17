const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const { registerCaptain,loginCaptain,GetCaptainProfile,logoutCaptain } = require('../controllers/captain.controller');
const { authCaptain } = require('../middleware/auth.middleware');

router.post('/register', [
  body('fullname.firstname').isLength({min:3}).withMessage('first name must be at least 3 characters long'),
  body('fullname.lastname').isLength({min:3}).withMessage('last name must be at least 3 characters long'),
  body('email').isEmail().withMessage('email is required'),
  body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
  body('vehicle.color').isLength({min:3}).withMessage('vehicle color must be at least 3 characters long'),
  body('vehicle.plate').isLength({min:3}).withMessage('vehicle plate must be at least 3 characters long'),
  body('vehicle.capacity').isInt({min:1, max:6}).withMessage('vehicle capacity must be between 1 and 6'),
  body('vehicle.type').isIn(['car', 'bike', 'auto']).withMessage('vehicle type must be one of car, bike, auto')
], registerCaptain);


router.post('/login', [
  body('email').isEmail().withMessage('email is required'),
  body('password').isLength({min:6}).withMessage('password must be at Least 6 characters long')
],loginCaptain);


router.get('/profile',authCaptain,GetCaptainProfile);

router.get('/logout', authCaptain, logoutCaptain);;
module.exports = router;
