const mongoose = require('mongoose')

// User schema

let userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    hash:{
        type: String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    subbed:{
        type:Boolean,
        required:true,
    },
    subType:{
        type:String 
    },
    userType:{
        type:String,
        required:true
    },
    registrationString:{
        type:String
    },
    isConfirmed:{
        type:Boolean,
        default:false,
        required:true
    }
})

let User = module.exports = mongoose.model('User', userSchema)