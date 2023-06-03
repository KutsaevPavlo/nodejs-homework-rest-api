const {Schema, model} = require('mongoose');
const Joi = require('joi')

const {handleMongooseError} = require('../helpers');

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
}, {versionKey: false})

contactSchema.post("save", handleMongooseError)


const addShema = Joi.object({
    name: Joi.string().required(),
      email: Joi.string().required().email(),
      phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
      favorite: Joi.boolean(),
  });

const updateFavoriteShema = Joi.object({
    favorite: Joi.boolean().required(),
})

const shemas = {
    addShema,
    updateFavoriteShema,
}

const Contact = model("contact", contactSchema);

module.exports = {
    Contact,
    shemas,
};


