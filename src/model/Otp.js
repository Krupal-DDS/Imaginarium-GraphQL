const mongoose = require('mongoose')

const OtpSchema = mongoose.Schema({    
    email:{
        type:String,
        require:true
    },
    otp:{
        type:String,
        require:true
    },
    createdAt:Date,
    expiresAt:Date
})

module.exports = mongoose.model('OtpData',OtpSchema)