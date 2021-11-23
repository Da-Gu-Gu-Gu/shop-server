const mongoose = require('mongoose')
const {ObjectId}=mongoose.Types.ObjectId

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required:true
    },
    categories: {
        type: Array,
      
    },
    img: {
        type: String,
        required:true
    },
    size: {
        type: String,
        required:true
    },
    color: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("Product", ProductSchema)