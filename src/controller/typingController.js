const typingModel=require('../models/typingModel');
const userModel=require('../models/userModel');
const Validator=require('../validation/valid')


const userTyping= async (req,res)=>{
    try{
       const userId=req.params.userId
       const data=req.body
       if (!Validator.isValid(userId)) return res.status(400).send({ status: false, message: "userId is Required" });

       if (!Validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId is not valid" });
       //check the  user id are present in decoded token
       let User = await userModel.findById(userId)
       if (!User) return res.status(404).send({ status: false, msg: "User not exist" })
       data.userId=userId

       let checkRank=await typingModel.find()

       let createTyping=await typingModel.create(data);

        return res.status(201).send({status:true,message:createTyping})

    }catch(err){
        return res.status(500).send({status:false,msg:err.message});
    }
}
const getTypingById=async (req,res)=>{
    try{
        const userId=req.params.userId
       
        if (!Validator.isValid(userId)) return res.status(400).send({ status: false, message: "userId is Required" });
 
        if (!Validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId is not valid" });
      
        let typingList = await typingModel.find({userId:userId}).select({userId:0,_id:0})
        if (typingList.length <=0) return res.status(404).send({ status: false, msg: "User not exist" })
        return res.status(200).send({status:true,msg:typingList});
    }catch(err){
        return res.status(500).send({status:false,msg:err.message});
    }
}
var rankArray=[]
let rest=[]
const getTypinglist=async (req,res)=>{
    try{
        let mysort={WPM:-1}
        let list=await typingModel.find().sort(mysort).populate('userId')

        for (let i = 0; i < list.length; i++) {
            rankArray[i] = list[i]['WPM'];
        }
        // passing the rank array and the resultset to the giveRank() function
        (giveRank(rankArray,list));
      
        // console.log(rest)
        return res.status(200).send({status:true,msg:rest})

    }catch(err){
        return res.status(500).send({status:false,msg:err.message});
    }
}

function giveRank(arrayArg,resultArg){
    // declaring and initilising variables
      let rank = 1;
      prev_rank = rank;
      position = 0;
      // displaying the headers in the console
      console.log('\n-------OUR RESULTS------\n');
      console.log('Name | WPM | Rank\n');
      rest.push('Name  WPM  Rank')
      // looping through the rank array
      for (let i = 0; i < arrayArg.length ; i ++) {
              /*
              If it is the first index, then automatically the position becomes 1.
              */
              if(i == 0) {
                  position = rank;
                //   console.log (resultArg[i].userId.FirstName+"\t"+arrayArg[i]+"\t"+position)+"\n";
                  rest.push(resultArg[i].userId.FirstName+"  "+arrayArg[i]+"  "+position)
              /*
              if the value contained in `[i]` is not equal to `[i-1]`, increment the `rank` value and assign it to `position`.
              The `prev_rank` is assigned the `rank` value.
              */
              } else if(arrayArg[i] != arrayArg[i-1]) {
              rank ++;
              position = rank;
              prev_rank = rank;
            //   console.log  (resultArg[i].userId.FirstName+"\t"+arrayArg[i]+"\t"+position)+"\n";
              rest.push(resultArg[i].userId.FirstName+"  "+arrayArg[i]+"  "+position)+'\n'
              /*
              Otherwise, if the value contained in `[i]` is equal to `[i-1]`,
              assign the position the value stored in the `prev_rank` variable then increment the value stored in the `rank` variable.*/
              } else {
                  position = prev_rank;
                  rank ++;
                //   console.log  (resultArg[i].userId.FirstName+"\t"+arrayArg[i]+"\t"+position)+"\n";
                  rest.push(resultArg[i].userId.FirstName+"  "+arrayArg[i]+"  "+position)+'\n'
              }
      }
  }
module.exports={userTyping,getTypingById,getTypinglist}