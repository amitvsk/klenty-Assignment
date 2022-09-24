const userModel=require('../models/userModel');
const Validator=require('../validation/valid');
const os=require('node:os');
const jwt = require("jsonwebtoken");

const userRegister=async (req,res)=>{
    try{
        let data=req.body
       const {FirstName,LastName,email,phone,password}=data

       if(!Validator.isValidReqBody(data)){return res.status(400).send({status:false,msg:"Please provide user data"})}

       if(!Validator.isValid(FirstName)) return res.status(400).send({status: false,message: "FirstName is Required"});
       if (!Validator.isValidString(FirstName)) return res.status(400).send({ status: false, message: "FirstName name  must be alphabetic characters" });
       if(LastName){
       if (!Validator.isValidString(LastName)) return res.status(400).send({ status: false, message: "Invalid last name name : Should contain alphabetic characters only" });
        }
        if(!Validator.isValid(email)) return res.status(400).send({status: false,message: "email is Required"});
       if (!Validator.isValidEmail(email)) return res.status(400).send({ status: false, message: "Invalid email address" });
      
         //check unique email
         const isEmailUsed = await userModel.findOne({email: email });
         if (isEmailUsed) return res.status(400).send({ status: false, message:  "email is already used, try different one"});
        if(phone){
       if (!Validator.isValidPhone(phone)) return res.status(400).send({ status: false, message: "Invalid phone number : must contain 10 digit and only number." });
        }
       if(!Validator.isValid(password)) return res.status(400).send({status: false,message: "Password is Required"});
       if (!Validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Invalid password (length : 8-16) : Abcd@123456"});

      let device= os.hostname(); // user device name
      data.device=device; 

      let deviceIP=req.ip; // user device ip address
      data.deviceIP=deviceIP;
      let user = await userModel.create(data)
      return res.status(201).send({status:true,msg:user})


    }catch(err){
        return res.status(500).send({status:false,msg:err.message});
    }
}


const userLogin = async (req,res)=>{
try{
     /*----------------------------validations ----------------------------*/
     let data = req.body
     const {email,password}=data
     if(!Validator.isValidReqBody(data)){return res.status(400).send({status:false,msg:"Please provide user details"})}
       
     if(!Validator.isValid(email)){ return res.status(400).send({status: false,message: "Email is Required"});}
   
     if(!Validator.isValid(password)){return res.status(400).send({status: false,message: "Password is Required"});}
    
     let logCheck = await userModel.findOne({email:email});
     if(!logCheck){
         return res.status(400).send({ status: false, message: "This email id  not valid"});
     }
     console.log(logCheck.password)
     if(logCheck.password !=password){
        return res.status(400).send({ status: false, message: "Password not valid"});
     }
    
     //create the jwt token 
     let token = jwt.sign({
         userId:logCheck._id.toString(),

     },"klentyAssignment",{expiresIn: "1200s" });
     res.header("Authorization", "Bearer : " + token);
    
    return res.status(200).send({ status: true, message: "Login Successful",user:logCheck._id.toString(),iat:new String(Date()),token: token})
}catch(err){
        return res.status(500).send({status:false,msg:err.message});
    }
}

module.exports={userRegister,userLogin}