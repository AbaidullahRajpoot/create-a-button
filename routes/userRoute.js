const express = require("express");
const userController = require('../controller/userController');
const verifyToken = require("../middleware/verifyToken");
const cors = require('cors')

// router
const router = express.Router();
express().use(cors())

//confirmEmail
router.get('/test', (req,res)=>{
    res.json({
        message:"ok 2"
    })
});
router.get('/confirmEmail/:token', userController.confirmEmail);
// add a user
router.post("/signup", userController.signup);
// login
router.post("/login", userController.login);
// me
router.get("/me",verifyToken, userController.getMe);
//forget-password
router.patch('/forget-password', userController.forgetPassword);
// confirm-forget-password
router.patch('/confirm-forget-password', userController.confirmForgetPassword);
// change password
router.patch('/change-password', userController.changePassword);
// change password
router.put('/update-user/:id', userController.updateUser);

module.exports = router;
