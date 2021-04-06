const mongoose = require('mongoose')

// User schema

let categorySchema = mongoose.Schema({
    
    categoryName:{
        type:String,
        required:true,
        unique:true
    },
    users:{
        type:Array
    }
})

let Category = module.exports = mongoose.model('Category', categorySchema)