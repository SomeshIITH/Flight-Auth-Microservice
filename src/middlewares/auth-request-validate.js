const {StatusCodes} = require('http-status-codes');

const AuthRequestValidate = (req,res,next) => {
    if(!req.body.email || !req.body.password){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "Email and password are required fields",
            err : {message : "Email and password are required fields"}
        })
    }
    next();
}

module.exports = {
    AuthRequestValidate
}