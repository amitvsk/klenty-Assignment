const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
userId:{
    type:ObjectId,
    ref:'user'
},
// rank:{
//     type:Number,
//     default:0
// },
WPM:{
    type:Number,
    default:0
},
totalTime:{
    type:String,
    default:0
},
mistake:{
    type:Number,
    default:'0s'
},
CPM:{
    type:Number,
    default:0
}
},{ timestamps: true })
module.exports = mongoose.model('userTyping',userSchema)