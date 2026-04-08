const {UserService} = require('./../service/index');
const {StatusCodes} = require('http-status-codes');
const userService = new UserService();


const signUp = async(req,res,next) => {
    try{
        const jwttoken = await userService.signUp(req.body);
        // Set the cookie here too so they are logged in immediately!
        res.cookie('jwttoken', jwttoken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // Fixed: camelCase maxAge
        });
        return res.status(StatusCodes.CREATED).json({
            data : jwttoken,
            success : true,
            message : "Successfully created a new user and return jwt",
            err : {}
        })
    }catch(error){
        next(error);
    }
}


const get = async(req,res,next) => {
    try{
        const user = await userService.getUser(req.params.id);
        return res.status(StatusCodes.OK).json({
            data : user,
            success : true,
            message : "Successfully fetched the user",
            err : {}
        })
    }catch(error){
       next(error);
    }
}

const destroy = async(req,res,next) => {
    try{
        await userService.deleteUser(req.params.id);
        return res.status(StatusCodes.OK).json({
            data : {},
            success : true,
            message : "Successfully deleted the user",
            err : {}
        })
    }catch(error){
        next(error);
    }
}

const signIn = async(req,res,next) => {
    try{
        const jwttoken = await userService.signIn(req.body.email,req.body.password);
        res.cookie('jwttoken',jwttoken, {
            httpOnly : true,    //Prevents JavaScript access (No XSS)
            maxAge : 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        })
        return res.status(StatusCodes.OK).json({
            data : jwttoken,
            success : true,
            message : "Successfully signed in",
            err : {}
        })
    }catch(error){
        next(error);
    }
}
const signOut = async(req,res,next) => {
    try{
        res.clearCookie('jwttoken'); // but still jwt will be valid till expiry which can be attacked 
        return res.status(StatusCodes.OK).json({
            data : {},
            success : true,
            message : "Successfully signed out",
            err : {}
        })
    }catch(error){
        next(error);
    }
}

const isAuthenticated = async(req,res,next) => {
    try{
        // const token = req.headers["x-access-token"];     //when not using cookie 
        const token = req.cookies.jwttoken; // Instead of req.headers
        const response = await userService.isAuthenticated(token);
        // console.log("Response from service layer in controller isAuthenticated",response);
        return res.status(StatusCodes.OK).json({
            data : response,
            success : true,
            message : "You are authenticated",
            err : {}
        })
    }catch(error){
        next(error);
    }
}
const isAdmin = async(req,res,next) => {
    try{
        const response = await userService.isAdmin(req.params.id);
        return res.status(StatusCodes.OK).json({
            data : response,
            success : true,
            message : response ? "User is an admin" : "User is NOT an admin",
            err : {}
        })
    }catch(error){
        next(error);
    }
}

const updateRole = async(req,res,next) => {
    try{
        const response = await userService.updateRole(req.body.id,req.body.role);
        return res.status(StatusCodes.OK).json({
            data : response,
            success : true,
            message : "You are an admin",
            err : {}
        })
    }catch(error){
        next(error);
    }
}
module.exports = {
    signUp,
    get,
    destroy,
    signIn,
    isAuthenticated,
    isAdmin,
    updateRole,
    signOut
}