    const HttpError = require("./HttpError")

    const validateRequestBody = (req, res, next) =>{
        if (!req.body || Object.keys(req.body).length === 0) {
            return next (HttpError(404, "missing fields"));
            }  
            next();

    }
    module.exports = validateRequestBody;