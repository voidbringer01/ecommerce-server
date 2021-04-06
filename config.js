const { connection } = require('mongoose');

const config = {
    dbConnection:'mongodb+srv://voidbringer0:0649506242dz@cluster0.ctgwq.mongodb.net/webshop?retryWrites=true&w=majority',
    secret:'sl_myjwtsecret'
}

module.exports = config;