const express=require('express')
const router=express.Router()
const Cart=require('../models/cart')
const auth=require('../middleware/auth')

//create
router.post('/create',auth,async(req,res)=>{
    try{
        let cart=await new Cart(req.body)
        cart=await cart.save()
        if(!cart) return res.status(500).send('The cart cannot be created')
        res.status(200).json("Successfully created")
       
    }
    catch(err){
        console.log(err)
    }
})

//get

router.get('/getall',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")
        await Cart.find().populate("userId").populate({path:'products',populate:'productId'})
        .then((cart)=>{
            if(!cart) return res.status(402).json("Error Occured")
            res.status(200).json(cart)
        })
    }
    catch(err){
        console.log(err)
    }
})

router.get('/:id',auth,async(req,res)=>{
    try{
        await Cart.findOne({userId:req.params.id}).populate("userId").populate({path:'products',populate:'productId'})
        .then((cart)=>{
            if(!cart) return res.status(402).json("Error Occured")
            res.status(200).json(cart)
        })
    }
    catch(err){
        console.log(err)
    }
})


//update
router.put('/:id',auth,async(req,res)=>{
    try{
        await Cart.findById(req.params.id)
        .then(async(cart)=>{
            if(!cart) return res.status(402).json("cart not found")
           await Cart.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{
                new:true
            })
           
            // if(!productUpdate)
            // return res.status(402).json('The product cannot be updated')
            // console.log(productUpdate)
            res.status(200).json("Update Successfully")
        })
    }
    catch(err){
        console.log(err)
    }
})

//delete
router.delete('/:id',auth,async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        .then((deleteLr)=>{
            if(!deleteLr) return res.status(402).json("Error Occured")
            res.status(200).json("Delete Successfully")
        })
    }
    catch(err){
        console.log(err)
    }
})

module.exports=router

















