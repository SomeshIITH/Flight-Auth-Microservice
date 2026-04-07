const {StatusCodes} = require('http-status-codes');

const globalErrorHandler = (err, req, res, next) => {
    // Default to 500 if it's not a custom AppError
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message: message,
        explanation: err.explanation || "Something went wrong on the server",
        data: {},
        // Show stack trace only in development to help debugging
        err: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = globalErrorHandler;