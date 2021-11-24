const express=require('express')
const router=express.Router()
const Product=require('../models/product')
const auth=require('../middleware/auth')

//create
router.post('/create',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")

        let product=await new Product({
            title:req.body.title,
            des:req.body.des,
            categories:req.body.categories,
            img:req.body.img,
            size:req.body.size,
            color:req.body.color,
            price:req.body.price
        })
        product=await product.save()
        if(!product) return res.status(500).send('The product cannot be created')
        res.status(200).json("Successfully created")
       
    }
    catch(err){
        console.log(err)
    }
})

//get

router.get('/getall',async(req,res)=>{
    try{
        await Product.find()
        .then((product)=>{
            if(!product) return res.status(402).json("Error Occured")
            res.status(200).json(product)
        })
    }
    catch(err){
        console.log(err)
    }
})

router.get('/:id',async(req,res)=>{
    try{
        await Product.findById(req.params.id)
        .then((product)=>{
            if(!product) return res.status(402).json("Error Occured")
            res.status(200).json(product)
        })
    }
    catch(err){
        console.log(err)
    }
})

//update
//check adminLr
router.put('/:id',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")
        await Product.findById(req.params.id)
        .then((product)=>{
            if(!product) return res.status(402).json("Product not found")
            let productUpdate=Product.findByIdAndUpdate(req.params.id,{
                title:req.body.title,
                des:req.body.des,
                categories:req.body.categories,
                img:req.body.img,
                size:req.body.size,
                color:req.body.color,
                price:req.body.price
            },{
                new:true
            })
            // productUpdate=productUpdate.save()
            if(!productUpdate)
            return res.status(402).json('The product cannot be updated')
         
            res.status(200).json("Update Success")
        })
    }
    catch(err){
        console.log(err)
    }
})



//delete
router.delete('/:id',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")
        await Product.findByIdAndDelete(req.params.id)
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