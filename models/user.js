const {Schema, model} = require('mongoose');

const {handleMongooseError} = require('../helpers');

const {emailRegexp} = require('../constants/users');

const userShema = new Schema({    
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          match: emailRegexp,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
            type: String,
        },
        avatarURL:{
          type: String,
          required: true,
        }
      
}, {versionKey: false});

userShema.post("save", handleMongooseError)

const User = model("user", userShema)

module.exports = User;