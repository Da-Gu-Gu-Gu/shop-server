const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../models/user')
module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        res.status(402).json("invalid user")
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,process.env.JWT_SEC,(err,payload)=>{
        if(err) return res.status(402).json("error occured")

        const {userId}=payload
        User.findById(userId).then((userdata)=>{
            
            req.user=userdata
            console.log(req.user)
            next()
        })
       
    })
}