const AppError = require('./../utils/app-error.js');
const { StatusCodes } = require('http-status-codes');

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body); // safeParse doesn't throw, it returns an object

    if (!result.success) {
        // Flatten the errors into a readable string
        const errorMessage = result.error.errors
            .map(err => `${err.path.join('.')}: ${err.message}`)
            .join(', ');
        
        return next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
    }

    // Overwrite req.body with the parsed/cleaned data 
    // (though passthrough keeps extras, it also 'coerces' types if you use .coerce)
    req.body = result.data; 
    next();
};

module.exports = validate;