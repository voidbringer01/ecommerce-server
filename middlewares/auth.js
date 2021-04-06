const config = require('../config')
const jwt = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('x-auth-token');

    // check for token
    if(!token)
        res.status(401).json({msg:'You do not have permission to see that.'});

    try{    
        // verify token
        const decoded = jwt.verify(token, config.secret)

        // Add user from payload
        req.user = decoded;
        next()
    }catch(e){
        res.status(400).json({msg:'Token is not valid.'})
    }
}


module.exports = auth;