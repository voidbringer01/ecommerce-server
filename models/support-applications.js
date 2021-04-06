const mongoose = require('mongoose')

// User schema

let supportSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    data:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','declined'],
        required:true,
        default:'pending'
    }
})

let Support = module.exports = mongoose.model('Support', supportSchema)