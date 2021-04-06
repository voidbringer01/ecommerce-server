const mongoose = require('mongoose')

// User schema

let ticketsSchema = mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    issue:{
        type:String,
        required:true
    },
    data:{
        type:String,
        required:true
    },
    state:{
        type:String,
        enum:['pending','resolved'],
        required:true,
        default:'pending'
    },
    answer:{
        type:String
    }
})

let Tickets = module.exports = mongoose.model('Tickets', ticketsSchema)