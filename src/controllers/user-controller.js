const {UserService} = require('./../service/index');
const {StatusCodes} = require('http-status-codes');
const userService = new UserService();


const signUp = async(req,res) => {
    try{
        const user = await userService.createUser(req.body);
        return res.status(StatusCodes.CREATED).json({
            data : user,
            success : true,
            message : "Successfully created a new user",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong in the controller layer",
            err : {message : error.message}
        })
    }
}

const create = async(req,res) => {
    try{
        const user = await userService.createUser(req.body);
        return res.status(StatusCodes.CREATED).json({
            data : user,
            success : true,
            message : "Successfully created a new user",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong in the controller layer",
            err : {message : error.message}
        })
    }
}

const get = async(req,res) => {
    try{
        const user = await userService.getUser(req.params.id);
        return res.status(StatusCodes.OK).json({
            data : user,
            success : true,
            message : "Successfully fetched the user",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong in the controller layer",
            err : {message : error.message}
        })
    }
}

const destroy = async(req,res) => {
    try{
        await userService.deleteUser(req.params.id);
        return res.status(StatusCodes.OK).json({
            data : {},
            success : true,
            message : "Successfully deleted the user",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong in the controller layer",
            err : {message : error.message}
        })
    }
}

const signIn = async(req,res) => {
    try{
        const response = await userService.signIn(req.body.email,req.body.password);
        return res.status(StatusCodes.OK).json({
            data : response,
            success : true,
            message : "Successfully signed in",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong in the controller layer",
            err : {message : error.message}
        })
    }
}

const isAuthenticated = async(req,res) => {
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
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "You are not authenticated",
            err : {message : error.message}
        })
    }
}
const isAdmin = async(req,res) => {
    try{
        const response = await userService.isAdmin(req.body.id);
        return res.status(StatusCodes.OK).json({
            data : response,
            success : true,
            message : "You are an admin",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "You are not an admin",
            err : {message : error.message}
        })
    }
}
module.exports = {
    signUp,
    create,
    get,
    destroy,
    signIn,
    isAuthenticated,
    isAdmin
}