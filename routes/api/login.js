const express = require('express')
const router = express.Router()
const config = require('../../config')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const validPassword = require('./../../utils/passwordUtils').validPassword
const auth = require('../../middlewares/auth')

router.post('/',(req,res,next)=>{
    let {uname, pw} = req.body
    User.findOne({username:uname}).then(user=>{
        if (!user) return res.status(400).json({msg:'User does not exist.',token:null,user:null});
        const isValid = validPassword(pw, user.hash, user.salt)
        if(!user.isConfirmed)
            res.json({msg:'Your acc is not confirmed.',token:null,user:null});

        if(isValid){
            jwt.sign({
                id:user.id,
                uname:user.username
            },
            config.secret,
            {expiresIn: 3600*24},
            (err,token)=>{
                if(err) throw err;
                res.json({
                    msg:null,
                    token,
                    user:{
                        id:user.id,
                        name:user.username,
                        email:user.email,
                        userType:user.userType
                    }
                })
            }
            )
        }else{
            res.json({msg:'Wrong password.',token:null,user:null});
        }
    })

})
router.get('/authenticated-data',auth,(req,res,next)=>{
    // console.log(req.headers)
    User.findById(req.user.id).select('-hash').select('-salt').then(user=>res.json(user))
})

// router.post('/',passport.authenticate('local',(err,user,info)=>{
//     req.login()
// },{failureRedirect:'/api/login/login-failure',successRedirect:'/api/login/login-success'})) //,(req,res,next)=>{
    // User.find({},function(err, users){
    //     if(err){
    //         console.log(err)
    //         res.json({err:'Doslo je do greske!'})
    //     }else{
    //         res.json(users)
    //     }
    // })
    // // console.log(req.session )


// })

// const auth = () => {
//     return (req, res, next) => {
//         passport.authenticate('local', (error, user, info) => {
//             console.log(user)
//             if(error)  res.status(400).json({"statusCode" : 200 ,"message" : error});
//             req.login(user, function(error) {
//                 if (error) return next(error);
//                 next();
//             });
//         })(req, res, next);
//     }
// }

// function checkAuthentication(req,res,next){
//     console.log(req.sesssion)
//     if(req.isAuthenticated()){
//         //req.isAuthenticated() will return true if user is logged in
//         next();
//     } else{
//         res.json({authenticated:'false'});
//     }
// }

// router.post('/',passport.authenticate('local'),login)

// router.post('/',auth(),(req,res)=>{
//     res.status(200).json({"msg":"OK"})
// })
// router.post('/',passport.authenticate('local',(err,user,info)=>{
//     req.login()
// },{failureRedirect:'/api/login/login-failure',successRedirect:'/api/login/login-success'})) //,(req,res,next)=>{
    // User.find({},function(err, users){
    //     if(err){
    //         console.log(err)
    //         res.json({err:'Doslo je do greske!'})
    //     }else{
    //         res.json(users)
    //     }
    // })
    // // console.log(req.session )


// })

// router.get('/login-success', (req, res, next) => {
//     res.json({msg:'OK'});
// });

// router.get('/login-failure', (req, res, next) => {
//     res.json({msg:'NOTOK'});
// });

// router.get('/logout',(req,res,next)=>{
//     req.logout()
//     res.json({msg:'logout-success'})
// })

module.exports = router;