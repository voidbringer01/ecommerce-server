const mongoose = require('mongoose')

// User schema

let transactionSchema = mongoose.Schema({
    buyer:{
        type:String,
        required:true
    },
    seller:{
        type:String,
        required:true
    },
    buyerAddress:{
        type:String,
        required:true
    },
    item:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        enum:['pending','shiped','delivered','canceled'],
        required:true,
        default:'pending'
    }
})

let Transaction = module.exports = mongoose.model('Transaction', transactionSchema)