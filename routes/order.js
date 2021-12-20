const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')

//create
router.post('/create', auth, async (req, res) => {
    try {
        let order = await new Order(req.body)
        order = await order.save()
        if (!order) return res.status(500).send('The order cannot be created')
        res.status(200).json("Successfully created")

    }
    catch (err) {
        console.log(err)
    }
})

//get

router.get('/getall', auth, async (req, res) => {
    try {
        if (!req.user.adminLr) return res.status(200).json("access denied")
        await Order.find().populate("userId").populate({path:'products',populate:'productId'})
            .then((order) => {
                if (!order) return res.status(200).json("Error Occured")
                res.status(200).json(order)
            })
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        await Order.find({ userId: req.params.id }).populate("userId").populate({path:'products',populate:'productId'})
            .then((order) => {
                if (!order) return res.status(200).json("No order")
                res.status(200).json(order)
            })
    }
    catch (err) {
        console.log(err)
    }
})


//update
router.put('/:id', auth, async (req, res) => {
    try {
        if (!req.user.adminLr) return res.status(200).json("access denied")
        await Order.findById(req.params.id)
            .then(async (order) => {
                if (!order) return res.status(200).json("order not found")
                await Order.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, {
                    new: true
                })

                // if(!productUpdate)
                // return res.status(200).json('The product cannot be updated')
                // console.log(productUpdate)
                res.status(200).json("Update Successfully")
            })
    }
    catch (err) {
        console.log(err)
    }
})

//delete
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!req.user.adminLr) return res.status(200).json("access denied")
        await Order.findByIdAndDelete(req.params.id)
            .then((deleteLr) => {
                if (!deleteLr) return res.status(200).json("Error Occured")
                res.status(200).json("Delete Successfully")
            })
    }
    catch (err) {
        console.log(err)
    }
})

//get monthly income
// router.get('/monthly/income', auth, async (req, res) => {
//     try {
//         if (!req.user.adminLr) return res.status(200).json("access denied")
//         const date =  Date.now()
//         const lastMont =  Date(date.setMonth(date.getMonth() - 1))
//         const previousMonth =  Date( Date().setMonth(lastMont.getMonth() - 1))

//         const income = await Order.aggregate([
//             { $match: { createdAt: { $age: previousMonth } } },
//             {
//                 $project: {
//                     month: { $month: "$createdAt" },
//                     sales: "$amount"
//                 }, 
//                 $group: {
//                     _id: "$month",
//                     total: { $sum: "$sales" },
//                 },
//             },   
//         ])
// res.status(200).json(income)

//     }
//     catch (err) {
//     console.log(err)
// }
// })

module.exports = router