const express = require('express')
const router = express.Router()
const Plans = require('../../models/plans')

router.get('/',async (req,res,next)=>{
    let plans = []
    const cursor = Plans.find().cursor()
    
    for (let plan = await cursor.next();plan!=null;plan=await cursor.next()){
        plans.push(plan)
    }
    
    res.json(plans)
})


module.exports = router;