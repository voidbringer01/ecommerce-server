// const { response } = require('express')
const express = require('express')
const router = express.Router()
const Tickets = require('../../models/tickets')
const User = require('../../models/user')
const auth = require('../../middlewares/auth')

router.get('/countall/:_id',auth,async(req,res,next)=>{
    Tickets.countDocuments({user_id:req.params._id},(err,count)=>{
        res.json({count:count})
    })
})

router.get('/skip/:num/:id',auth,async(req,res,next)=>{
    let stores = []
    const cursor = Tickets.find({user_id:req.params.id}).sort({'date':-1}).skip((req.params.num-1)*5).limit(5).cursor()
    for(let store = await cursor.next();store!=null; store = await cursor.next()){
        stores.push(store)
    }
    res.json(stores)
})

router.get('/countall',auth,async(req,res,next)=>{
    Tickets.countDocuments({},(err,count)=>{
        res.json({count:count})
    })
})
router.get('/skip/:num',auth,async(req,res,next)=>{
    let stores = []
    const cursor = Tickets.find({}).sort({'date':-1}).skip((req.params.num-1)*5).limit(5).cursor()
    for(let store = await cursor.next();store!=null; store = await cursor.next()){
        stores.push(store)
    }
    res.json(stores)
})


router.get('/countall/pending',auth,async(req,res,next)=>{
    Tickets.countDocuments({state:'pending'},(err,count)=>{
        res.json({count:count})
    })
})

router.get('/pending/skip/:num',auth,async(req,res,next)=>{
    let stores = []
    const cursor = Tickets.find({state:'pending'}).sort({'date':-1}).skip((req.params.num-1)*5).limit(5).cursor()
    for(let store = await cursor.next();store!=null; store = await cursor.next()){
        stores.push(store)
    }
    res.json(stores)
})

router.post('/' ,auth,(req,res,next)=>{
    let {user_id,issue,data} = req.body
    // Categories.findOne({categoryName:categoryName}).then(category=>{
    //     if(category)
    //         return res.json({msg:'That category already exists.',category})
    // })

    const newCategory = new Tickets({
        user_id,
        issue,
        data,
        state:'pending'
    })
    newCategory.save().then((category)=>{
        res.json({msg:'OK'})
    }).catch(err=>{
        res.json({msg:'That category already exists.'})
    })
})

router.put('/:_id/:answer',auth, (req,res,next)=>{
    let {_id,answer} = req.params;
    
    Tickets.findOneAndUpdate({_id},{
        state:'resolved',
        answer
    }).then(response=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json(err)
    })
    // res.json({msg:'OK'})
})








module.exports = router;