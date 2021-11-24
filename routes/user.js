const express=require('express')
const router=express.Router()
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const AccessToken=require('../models/accesstoken')
const sendEmail=require('../utils/email')
const auth=require('../middleware/auth')

//Register

router.post('/register',async(req,res)=>{
    try{
        let emailCheck=await User.findOne({email:req.body.email})
        if(emailCheck) return res.status(402).json("Email already exist")
        let hashPassword=bcrypt.hash(req.body.password,10)
        .then((hashPassword)=>{
        let user=new User({
            name:req.body.name,
            email:req.body.email,
            password:hashPassword,
            profile:req.body.profile,
            adminLr:req.body.adminLr
        })

         user.save()
        let accessToken=new AccessToken({
            userId:user._id,
            token:`fadsf13v90${Math.random()*1000}${user._id}f2hgnvk`
        })
       accessToken.save()
       console.log(accessToken)
            const message=`${process.env.BASE_URL}/api/user/verify/${user._id}/${accessToken.token}`
             sendEmail(user.email,"Verify Account",message)
            res.status(200).json("Email sent your account plz verify")
        })
    }
    catch(err){
        console.log(err)
    }
})

//verfiy
router.put('/verify/:id/:token',async(req,res)=>{
    try{
        let userCheck=await User.findById(req.params.id)
        if(!userCheck) return res.status(402).json("Invalid User")

        let tokenCheck=await AccessToken.findOne({token:req.params.token})
        if(!tokenCheck) return res.status(402).json("Invalid Token")

        await User.findByIdAndUpdate(req.params.id,{
            verify:true
        },{
            new:true
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
        await User.findOne({email:req.body.email})
        .then(savedUser=>{
            
            if(!savedUser) return res.status(402).json("User Not Found")

            if(!savedUser.verify)return res.status(402).json("Plz verify your account first")
                if(bcrypt.compareSync(req.body.password,savedUser.password)){
                    console.log(savedUser)
                    const token=jwt.sign({
                        userId:savedUser._id
                    },
                    process.env.JWT_SEC
                )
                    res.status(200).send({token:token})
                }
                return res.status(402).json("Invalid email or password")
            
        })
    }
    catch (err){
            console.log(err)
    }
})

//forgetpassword
router.post('/forgotpassword',async(req,res)=>{
    try{
        let emailCheck=await User.findOne({email:req.body.email})
        if(!emailCheck) return res.status(402).json("Invalid Email")

        let token=new AccessToken({
            userId:emailCheck._id,
            token:`fadsf13v90${Math.random()*1000}${emailCheck._id}f2hgnvk`
        })
        token.save()
        .then(()=>{
            const message=`${process.env.BASE_URL}/api/user/resetpassword/${emailCheck._id}/${token.token}`
             sendEmail(emailCheck.email,"Password Reset",message)
            res.status(200).json("Email sent your account")
        })
        

    }
    catch(err){
        console.log(err)
    }
})

//resetpassword
router.put('/resetpassword/:id/:token',async(req,res)=>{
    try{
        let userCheck=await User.findById(req.params.id)
        if(!userCheck) return res.status(402).json("Invalid User")

        let tokenCheck=await AccessToken.findOne({token:req.params.token})
        if(!tokenCheck) return res.status(402).json("Invalid Token")

        const {password,confirmPassword}=req.body

        if(password!==confirmPassword) return res.status(402).json("Password Doesn't match")
     
        let passwordUpdate=await User.findByIdAndUpdate(req.params.id,{
            password:await bcrypt.hashSync(password,10)
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

router.get('/getall',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")
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

router.get('/:id',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")
        await User.findById(req.params.id)
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
router.put('/admin/:id',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")
        await User.findById(req.params.id)
        .then(async(user)=>{
            if(!user) return res.status(402).json("Error Occured")
           await User.findByIdAndUpdate(req.params.id,{
                profile:req.body.profile,
                name:req.body.name,
                adminLr:req.body.adminLr,
                verify:req.body.verify
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

router.put('/:id',auth,async(req,res)=>{
    try{
        await User.findById(req.params.id)
        .then(async(user)=>{
            if(!user) return res.status(402).json("Error Occured")
            await User.findByIdAndUpdate(req.params.id,{
                profile:req.body.profile,
                name:req.body.name,
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
router.delete('/:id',auth,async(req,res)=>{
    try{
        if(!req.user.adminLr) return res.status(402).json("access denied")
        await User.findByIdAndDelete(req.params.id)
        .then((user)=>{
            if(!user) return res.status(402).json("Error Occured")
            res.status(200).json("Delete Successfully")
        })
    }
    catch(err){
        console.log(err)
    }
})


module.exports=router