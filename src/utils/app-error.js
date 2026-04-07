class AppError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
        this.message = message
        // This is what your Global Error Handler uses to show the details to the user
        this.explaination = message
        
        // This ensures the stack trace doesn't include the AppError constructor itself
        //it keeps the stack trace clean. It prevents the AppError class itself from appearing in the logs,
        //  so when we look at an error, we see exactly which Service or Repository triggered the failure, making debugging much faster
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;