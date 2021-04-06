const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const Transaction = require('../../models/transactions.js')
const ShopItem = require('../../models/shopItem')

router.get('/sell/:userName',auth, async (req,res,next)=>{
    let cursor = Transaction.find({seller:req.params.userName}).cursor()

    let orders = []

    for (let order = await cursor.next();order!=null;order = await cursor.next()){
        orders.push(order)
    }

    res.json(orders)
})

router.get('/seller/countall/:name',auth,async (req,res,next)=>{
    Transaction.countDocuments({seller:req.params.name},(err,count)=>{
        res.json({count:count})
    })
})

router.get('/seller/skip/:name/:num',auth,async (req,res,next)=>{
    let numb = req.params.num - 1
    let _name = req.params.name
    console.log(_name)
    console.log(numb)
    let transactions = []
    const cursor = Transaction.find({seller:_name}).sort({'date':-1}).skip(numb*10).limit(10).cursor()
    for(let transaction = await cursor.next();transaction!=null;transaction=await cursor.next()){
        transactions.push(transaction)
    }
    res.json(transactions)
})

router.get('/buyer/countall/:_id',auth,async (req,res,next)=>{
    Transaction.countDocuments({buyer:req.params._id},(err,count)=>{
        res.json({count:count})
    })
})

router.get('/buyer/skip/:_id/:num',auth,async (req,res,next)=>{
    let numb = req.params.num -1
    let _id = req.params._id
    let transactions = []
    const cursor = Transaction.find({buyer:_id}).sort({'date':-1}).skip(numb*10).limit(10).cursor()
    for(let transaction = await cursor.next();transaction!=null;transaction=await cursor.next()){
        transactions.push(transaction)
    }
    res.json(transactions)
})

router.get('/buy/:user_id',auth, async (req,res,next)=>{
    let cursor = Transaction.find({buyer:req.params.user_id}).cursor()

    let orders = []

    for (let order = await cursor.next();order!=null;order = await cursor.next()){
        orders.push(order)
    }
    
    res.json(orders)
})


router.post('/',auth,(req,res,next)=>{
    let {buyer,seller,buyerAddress,item,amount} = req.body
    console.log(req.body)
    const newTransaction = new Transaction({
        buyer,seller,buyerAddress,item,amount,state:'pending'
    })
    newTransaction.save().then((transaction)=>{
        res.json({msg:'OK'})
    }).catch(err=>{
        res.json({msg:err})
    })

    ShopItem.findOneAndUpdate({_id:item},{$inc:{suppliesLeft:-amount}}).then(shpitem=>{

    }).catch(err=>{
        console.log(err)
    })
})

router.put('/:_id',auth,(req,res,next)=>{
    let _id = req.params._id
    let state = req.body.state
    console.log(state)
    
    Transaction.findOneAndUpdate({_id},{state}).then(res=>{
        if(state=='canceled'){
            ShopItem.findOneAndUpdate({_id:res.item},{$inc:{suppliesLeft:res.amount}}).then(res=>{
                console.log(res)
            }).catch(err=>{
                console.log('Nije udpated, greska')
                // res.json({msg:err})
            })
        }
        res.json({msg:'OK'})
    }).catch(err=>{
        res.json({msg:'greska'})
    })
})

router.delete('/:_id',auth,(req,res,next)=>{
    Transaction.findOneAndDelete({_id:req.params._id}).then(respon=>{
        ShopItem.findOneAndUpdate({_id:respon.item},{$inc:{suppliesLeft:respon.amount}}).then(response=>{
            console.log('successful recover')
            res.json({msg:'OK'})
        }).catch(err=>{
            res.json({msg:err})
        })
    }).catch(err=>{
        res.json({msg:err})
    })
})

module.exports = router;