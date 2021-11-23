const mongoose = require('mongoose')
const {ObjectId}=mongoose.Types.ObjectId

const CartSchema = new mongoose.Schema({
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
   ]
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("Cart", CartSchema)