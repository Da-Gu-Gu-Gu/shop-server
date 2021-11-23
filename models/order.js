const mongoose = require('mongoose')
const {ObjectId}=mongoose.Types.ObjectId

const OrderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
       ref:"User"
    },
   products:[
       {
           productId:{
               type:ObjectId,
               ref:"Product"
           },
           quantity:{
               type:Number,
                default:1
           }
       }
   ],
   amount:{
       type:Number,
       required:true
   },
   address:{
       type:Object,
        required:true
   },
   status:{
       type:String,
       default:"Pending "
   }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("Order", OrderSchema)