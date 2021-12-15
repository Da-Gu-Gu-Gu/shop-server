const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')


//routes 
const user=require('./routes/user')
const product=require('./routes/product')
const order=require('./routes/order')
const cart=require('./routes/cart')
const payment=require('./routes/stripe')

//middleware
dotenv.config()
app.use(cors())
app.use(express.json())


app.use('/api/user/',user)
app.use('/api/product/',product)
app.use('/api/order/',order)
app.use('/api/cart/',cart)
app.use('/api/payment',payment)

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
    console.log("good")
})
.catch(err=>{
    console.log(err)
})

app.listen(3000,(req,res)=>{
    console.log("server is running")
})