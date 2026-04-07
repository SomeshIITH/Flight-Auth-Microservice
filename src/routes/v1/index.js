const express = require('express');
const router = express.Router();
//add routing logic

const {UserController} = require('./../../controllers/index')
// const {AuthRequestMiddleWareValidate} = require('./../../middlewares/index')
const userSchema = require('./../../utils/user-validator');
const validate = require('./../../middlewares/validate-request.js');

//public routes
router.post('/users/signup',validate(userSchema),UserController.signUp);
router.post('/users/signin',validate(userSchema),UserController.signIn);

//admin access routes
router.get('/users/isauthenticated',UserController.isAuthenticated);
router.get('/users/isadmin/:id',UserController.isAdmin);//get in req.body.id


router.get('/users/:id',UserController.get)
router.delete('/users/:id',UserController.destroy)



// router.post('/user/signup', AuthRequestMiddleWareValidate.AuthRequestValidate, UserController.signUp)
// router.post('/user/signin',AuthRequestMiddleWareValidate.AuthRequestValidate , UserController.signIn)
// router.get('/user/isAuthenticated',UserController.isAuthenticated);
// router.get('/user/isAdmin',UserController.isAdmin);//get in req.body.id

// router.get('/user/:id',UserController.get)
// router.delete('/user/:id',UserController.destroy)


module.exports  = router