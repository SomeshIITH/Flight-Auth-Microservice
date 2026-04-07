const express = require('express');
const router = express.Router();
//add routing logic

const {UserController} = require('./../../controllers/index')
const {AuthRequestMiddleWareValidate} = require('./../../middlewares/index')

router.post('/user/signup', AuthRequestMiddleWareValidate.AuthRequestValidate, UserController.signUp)
router.post('/user/signin',AuthRequestMiddleWareValidate.AuthRequestValidate , UserController.signIn)
router.get('/user/isAuthenticated',UserController.isAuthenticated);
router.get('/user/isAdmin',UserController.isAdmin);//get in req.body.id

router.get('/user/:id',UserController.get)
router.delete('/user/:id',UserController.destroy)


module.exports  = router