const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
    },
    adminLr: {
        type: Boolean,
        default: false
    },
    verify: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("User", UserSchema)