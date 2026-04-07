const { up } = require('../migrations/20260405052356-create-user');
const {UserService} = require('./../service/index');
const {StatusCodes} = require('http-status-codes');
const userService = new UserService();


const signUp = async(req,res,next) => {
    try{
        const jwttoken = await userService.signUp(req.body);
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

const isAuthenticated = async(req,res,next) => {
    try{
        const token = req.headers["x-access-token"];
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
        const response = await userService.isAdmin(req.body.id);
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
    updateRole
}