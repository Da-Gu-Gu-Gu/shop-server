const express=require('express')
const router=express.Router()
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const AccessToken=require('../models/accesstoken')
const sendEmail=require('../utils/email')

//Register

router.post('/register',async(req,res)=>{
    try{
        let emailCheck=await User.findOne({email:req.body.email})
        if(emailCheck) return res.status(402).json("Email already exist")
        let user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:bcrypt.hash(req.body.password,10),
            profile:req.body.profile,
            adminLr:req.body.adminLr
        })

        await user.save()
        let accessToken=new AccessToken({
            userId:user._id,
            token:bcrypt.hash(Date.now(),10)
        }).save()
        .then(()=>{
            const message=`${process.env.BASE_URL}/api/user/verify/${user._id}/${accessToken.token}`
            await sendEmail(user.email,"Verify Account",message)
            res.status(200).json("Email sent your account plz verify")
        })
    }
    catch(err){
        console.log(err)
    }
})

//verfiy
router.get('verify/:id/:token',async(req,res)=>{
    try{
        let userCheck=await User.findById(req.params.id)
        if(!userCheck) return res.status(402).json("Invalid User")

        let tokenCheck=await AccessToken.findOne({token:req.params.token})
        if(!tokenCheck) return res.status(402).json("Invalid Token")

        await User.findByIdAndUpdate(req.params.id,{
            verify:true
        })
        await AccessToken.findByIdAndDelete(tokenCheck._id)

        res.status(200).json("Account Verified Successfully")
    }
    catch(err){
        console.log(err)
    }
})

//Login
router.post('/login',async(req,res)=>{
    try{
        await User.findOne({email:req.email})
        .then(savedUser=>{
            if(!savedUser) return res.status(402).json("User Not Found")
            bcrypt.compareSync(savedUser.password,req.password)
            .then(match=>{
                if(match){
                    jwt.sign(savedUser._id,process.env.JWT_SEC)
                    return res.status(200).json('Successfully login')
                }
                return res.status(402).json("Invalid email or password")
            })
        })
    }
    catch (err){
            console.log(err)
    }
})

//forgetpassword
router.post('/forgotpassword/',async(req,res)=>{
    try{
        let emailCheck=await User.findOne({email:req.body.email})
        if(!emailCheck) return res.status(402).json("Invalid Email")

        let token=new AccessToken({
            userId:emailCheck._id,
            token:bcrypt.hash(Date.now(),10)
        }).save()

        .then(()=>{
            const message=`${process.env.BASE_URL}/api/user/resetpassword/${emailCheck._id}/${token.token}`
            await sendEmail(emailCheck.email,"Password Reset",message)
            res.status(200).json("Email sent your account")
        })
        

    }
    catch(err){
        console.log(err)
    }
})

//resetpassword
router.post('/resetpassword/:id/:token',async(req,res)=>{
    try{
        let userCheck=await User.findById(req.params.id)
        if(!userCheck) return res.status(402).json("Invalid User")

        let tokenCheck=await AccessToken.findOne({token:req.params.token})
        if(!tokenCheck) return res.status(402).json("Invalid Token")

        const {password,confirmPassword}=req.body

        if(password!==confirmPassword) return res.status(402).json("Password Doesn't match")
        let passwordUpdate=await User.findByIdAndUpdate(req.params.id,{
            password:bcrypt.hash(password,10)
        },{
            new:true
        })

        await AccessToken.findByIdAndDelete(tokenCheck._id)
        res.status(402).json("Password Reset Successfully")
    }
    catch(err){
        console.log(err)
    }
})

//get

router.get('/getall',async(req,res)=>{
    try{
        await User.find()
        .then((user)=>{
            if(!user) return res.status(402).json("Error Occured")
            res.status(200).json(user)
        })
    }
    catch(err){
        console.log(err)
    }
})

router.get('/:id',async(req,res)=>{
    try{
        await User.findById(req.params._id)
        .then((user)=>{
            if(!user) return res.status(402).json("Error Occured")
            res.status(200).json(user)
        })
    }
    catch(err){
        console.log(err)
    }
})

//update
//check adminLr
router.put('/:id',async(req,res)=>{
    try{
        await User.findById(req.params._id)
        .then((user)=>{
            if(!user) return res.status(402).json("Error Occured")
            let user=await User.findByIdAndUpdate(req.body._id,{
                profile:req.body.profile,
                name:req.body.name,
                adminLr:req.body.adminLr
            },{
                new:true
            })
            res.status(200).json("Update Successfully")
        })
    }
    catch(err){
        console.log(err)
    }
})

//delete
router.delete('/:id',async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params._id)
        .then((user)=>{
            if(!user) return res.status(402).json("Error Occured")
            res.status(200).json(user)
        })
    }
    catch(err){
        console.log(err)
    }
})