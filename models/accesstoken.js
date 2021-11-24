const mongoose=require('mongoose')
const ObjectId=mongoose.Schema.Types.ObjectId

const accessToken=new mongoose.Schema({
    userId:{
        type:ObjectId,
        ref:"User"
    },
    token:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model("AccessToken",accessToken)