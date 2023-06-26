const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');
const {nanoid} = require('nanoid');


const {HttpError, ctrlWrapper, sendEmail} = require('../helpers');

const {SECRET_KEY, BASE_URL} = process.env;

const avatartDir = path.join(__dirname, "../", "public", "avatars");

const singup = async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
        throw HttpError (409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email);
        
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>` 
    }

    await sendEmail(verifyEmail);

    res.status(201).json({
    user: {
        email,
        subscription: "starter"
      }
})
}

const verify = async (req, res) =>{
const {verificationToken} = req.params;
const user = await User.findOne({verificationToken});
if(!user){
    throw HttpError(404, "User not found");
}
await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""})

res.json({
    message: "Verification successful"
})
}

const resendVerify = async (req, res) =>{
const {email}= req.body;
const user = await User.findOne({email});
if (!user){
    throw HttpError(404, "User not found");
}
if (user.verify){
    throw HttpError(400, "Verification has already been passed");
}
const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>` 
}

await sendEmail(verifyEmail);

res.json({
    message: "Verification email sent"
})

}


const singin = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if(!user.verify){
        throw HttpError(404, "User not found");
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


const apdateAvatar = async (req, res) =>{
    const {_id} = req.user;
const {path: tempUpload, originalname} = req.file;
const filename = `${_id}_${originalname}`
const resultUpload = path.join(avatartDir, filename);

await jimp
.read(tempUpload)
.then(avatar => avatar.resize(250,250).write(tempUpload))
.catch(err => console.error(err));

await fs.rename(tempUpload, resultUpload);
const avatarURL = path.join("avatars", filename);
await User.findByIdAndUpdate(_id, {avatarURL});
res.json({
    avatarURL,
})

}


module.exports = {
    singup: ctrlWrapper(singup),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    subscription: ctrlWrapper(subscription),
    apdateAvatar: ctrlWrapper(apdateAvatar),
}