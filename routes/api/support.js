const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const auth = require('../../middlewares/auth')
const Support = require('../../models/support-applications')
router.get('/',auth, async (req,res,next)=>{
    let cursor = Support.find().cursor()

    let apps = []
    for(let i = await cursor.next();i!=null;i = await cursor.next()){
        apps.push(i)
    }

    res.json(apps)
})

router.get('/countall',auth,async(req,res,next)=>{
    Support .countDocuments({},(err,count)=>{
        res.json({count:count})
    })
})

router.get('/skip/:num',auth,async(req,res,next)=>{
    let stores = []
    const cursor = Support.find({}).sort({'date':-1}).skip((req.params.num-1)*10).limit(10).cursor()
    for(let store = await cursor.next();store!=null; store = await cursor.next()){
        stores.push(store)
    }
    res.json(stores)
})

router.get('/:username',auth, async (req,res,next)=>{
    Support.findOne({username:req.params.username}).then((response)=>{
        if(response)
            res.json(response.status)
        else res.json('')
    }).catch(err=>{
        res.json(err)
    })
})

router.post('/',auth,(req,res,next)=>{
    let {username,data} = req.body

    let application = new Support({
        username,
        data,
        status:'pending'
    })

    application.save().then((apply)=>{
        res.json({msg:'OK'})
    }).catch(err=>{
        res.json({msg:err})
    })
})

router.put('/:_id/:status',auth,(req,res,next)=>{
    let {_id,status} = req.params;
    
    Support.findOneAndUpdate({_id},{
        status
    }).then(response=>{
        if(status=='accepted'){
            User.findOneAndUpdate({username:response.username},{userType:'support'}).then(user=>{
                res.json({msg:'OK'})
            }).catch(err=>{
                res.json({msg:'Doesnt exist.'})
            })
        }else{
            return res.json({msg:'OK'})
        }
    }).catch(err=>{
        return res.json(err)
    })
})



module.exports = router;

