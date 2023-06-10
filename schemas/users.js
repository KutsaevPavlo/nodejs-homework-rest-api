const Joi = require('joi');

const {emailRegexp} = require('../constants/users');

const userRegisterShema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userLoginShema = Joi.object({    
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

module.exports = {
    userRegisterShema,
    userLoginShema,
}