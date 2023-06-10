const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const {HttpError, ctrlWrapper} = require('../helpers');

const {SECRET_KEY} = process.env;

const singup = async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
        throw HttpError (409, "Email already in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
const newUser = await User.create({...req.body, password: hashPassword});
res.status(201).json({
    name: newUser.name,
    email: newUser.email,
})
}

const singin = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401);
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401);
    }

    const payload = {
        id: user._id,
    }
    
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    res.json({
        token,
    })
}


module.exports = {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
}