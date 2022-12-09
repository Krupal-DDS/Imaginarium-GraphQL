const { verify } = require('jsonwebtoken')
const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username :{
        type:String,
        require:true
    },
    firstname :{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    authToken:{
        type:String,
        require:true        
    },
    verify:{
        type:Boolean,
        require:true,
        default:false    
    },
    langauage:{
        enum : ['english','british','gujrati','german','spanish','russian'],
        default:"english",        
        type:String,
    },
    image:{
        type:String,        
    }
})

module.exports = mongoose.model('UserAuth',UserSchema)