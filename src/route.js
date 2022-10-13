const express = require("express"); //import express
const router = express.Router(); 
const userController=require('./controller/userController');
const typingController=require('./controller/typingController');
const {Authentication,Authorization}=require('./middleware/auth');

/********* User Api ***********/
router.post('/userRegister',userController.userRegister);
router.post('/Login',userController.userLogin);

/********* User typing Api ***********/
// router.get('/',(req,res)=>{return res.send('hello klenty')});
router.post('/testTyping/:userId',Authentication,Authorization,typingController.userTyping);
router.get('/getUserById/:userId',Authentication,Authorization,typingController.getTypingById);
router.get('/',typingController.getTypinglist);

module.exports = router;
