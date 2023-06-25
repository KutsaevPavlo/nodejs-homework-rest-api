const Joi = require('joi');

const {emailRegexp} = require('../constants/users');

const userRegisterShema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userLoginShema = Joi.object({    
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userEmailShema = Joi.object({    
    email: Joi.string().pattern(emailRegexp).required(),    
})

module.exports = {
    userRegisterShema,
    userLoginShema,
    userEmailShema,
}