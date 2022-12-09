const mongoose = require('mongoose')

const FeebackSchema = mongoose.Schema({    
    user:{
        type:String,
        require:true
    },
    type:{
        enum : ['Feedback','Feature Request','issue'],
        default:"Feedback",     
        type:String,
        require:true
    },
    question:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    }   
})

module.exports = mongoose.model('Feedback',FeebackSchema)