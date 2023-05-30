const {HttpError} = require('../helpers')

const validateBody = schema =>{
    const func = (req, res, next) =>{
      
        const {error} = schema.validate(req.body)
        if (error) {
          const nameMisssing = error.message.split(" ")[0];                    
          next (HttpError(400, `missing required ${nameMisssing} field`)) ;
        }
        next()

    }
    return func;
}

module.exports = validateBody;