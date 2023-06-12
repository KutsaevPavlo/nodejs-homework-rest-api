const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const {HttpError, ctrlWrapper} = require('../helpers');

const {SECRET_KEY} = process.env;

const singup = async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
        throw HttpError (409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
const newUser = await User.create({...req.body, password: hashPassword});
res.status(201).json({
    user: {
        email,
        subscription: "starter"
      }
})
}

const singin = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const {_id: id} = user;
    const payload = {
        id,
    }
    
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(id, {token});
    res.json({
        token,
        user: {
            email,
            subscription: "starter"
          }
    })
}

const getCurrent = async (req, res) => {
    const {name, email} = req.user;
    res.json({
        email,
        subscription: "starter",
    })
}

const logout = async (req, res) => {
const {_id}= req.user;
await User.findByIdAndUpdate(_id, {token: ""})
res.status(204).json()
}

const subscription = async (req,res) => {
    
    const {_id, email}= req.user;
    const user = await User.findOne({email});
    const {subscription} = req.body;
    await User.findByIdAndUpdate(_id, {subscription: subscription})
    res.json({
        user: {
            email,
            subscription,
        }
    })
}

module.exports = {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    subscription: ctrlWrapper(subscription),
}