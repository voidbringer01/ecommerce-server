const mongoose = require('mongoose')

// User schema

let shopItemSchema = mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    itemTitle:{
        type:String,
        required:true
    },
    imageName: {
        type:String,
        required:true
    },
    image:{
        data:Buffer,
        contentType:String  
    },
    smallDescription:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    suppliesLeft:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
})

let ShopItem = module.exports = mongoose.model('ShopItem', shopItemSchema)