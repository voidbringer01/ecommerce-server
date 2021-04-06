const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const auth = require('../../middlewares/auth')
const genPassword = require('../../utils/passwordUtils').genPassword
const nodemailer = require('nodemailer')
const randString = ()=>{
    const len = 8
    let randStr = ''
    for(let i =0;i<len;i++){
        const ch = Math.floor((Math.random()*10)+1)
        randStr += ch
    }
    return randStr
}

const sendMail = (mail, randStr)=>{
    var Transport = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'voidbringer01@gmail.com',
            pass:'0649506242Dz'
        }
    });

    var mailOptions;
    let sender = 'MojWebShop'
    mailOptions = {
        from:sender,
        to:mail,
        subject:'Email confirmation',
        html:`Press <a href=http://localhost:138.68.102.182/api/register/verify/${randStr}> here </a> to verify your email.` 
        // html:`Press <a href=http://localhost:3000/api/register/verify/${randStr}> here </a> to verify your email.` 
    }
    Transport.sendMail(mailOptions,function(err,response){
        if(err){
            console.log(err)
        }else{
            console.log('Message sent')
        }
    })
    
}
router.get('/verify/:str', async (req,res,next)=>{
    const {str} = req.params

    let user = await User.findOne({registrationString:str})
    if(user){
        user.isConfirmed = true
        await user.save()
        res.send('Success!')
    }else{
        res.json('user not found')
    }
})

router.post('/', (req,res,next)=>{
    // if(!req.body.uname || !req.body.email || !req.body.password){
    //     return res.status(400).json({msg:'Please enter all fields.'});
    // }

    User.findOne({email:req.body.email}).then(user=>{
        if(user)
            return res.json({msg:'User with that email already exists.'})
        else{
            User.findOne({username:req.body.uname}).then(user=>{
                if(user)
                    return res.json({msg:'User with that username already exists.'})
                else{
                    const saltHash = genPassword(req.body.password)
                    const generatedString = randString()
                    const salt = saltHash.salt
                    const hash = saltHash.hash
                    const newUser = new User({
                        username:req.body.uname,
                        hash:hash,
                        salt:salt,
                        email:req.body.email,
                        subbed:false,
                        userType:req.body.userType,
                        registrationString:generatedString
                    })
                    newUser.save().then((user)=>{
                        sendMail(req.body.email,generatedString)
                        console.log(user)
                        return res.json({msg:'OK'})
                    }).catch((err)=>{
                        console.log(err)
                        return  res.json({msg:'Unexpected error'})
                    })
                }
            })
        }
    })
})

router.put('/:_id',auth,(req,res,next)=>{
    let subType = req.body.subType
    console.log(req.params._id)
    User.findOneAndUpdate({_id:req.params._id},{subType:subType,subbed:true}).then(response=>{
        res.json({msg:'OK'})
    }).catch(err=>{
        res.json({msg:err})
    })
})

module.exports = router;