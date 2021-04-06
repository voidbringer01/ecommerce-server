const mongoose = require('mongoose')

// User schema

let plansSchema = mongoose.Schema({
    
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    catNum:{
        type:Number,
        required:true
    },
    itemNum:{
        type:Number,
        required:true
    }
})

let Plans = module.exports = mongoose.model('Plans', plansSchema)