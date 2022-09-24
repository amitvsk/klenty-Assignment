const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    FirstName: {
       type: String,
       default:'Guest'
      },
      LastName: {
       type: String,
      },
    email: {
       type: String,
       require:true
      },
  
    phone: {
       type: Number
      },
    password:{
        type:String,
        require:true
    },
    device:{
        type:String,
        required:true
    },
    deviceIP:{
      type:String,
      required:true
  },
   
    isDeleted:{
        type:Boolean,
        default:false
    }
   
  },{ timestamps: true })

module.exports = mongoose.model('user',userSchema)