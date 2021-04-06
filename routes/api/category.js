// const { response } = require('express')
const express = require('express')
const router = express.Router()
const Categories = require('../../models/category')
const User = require('../../models/user')
const auth = require('../../middlewares/auth')
// const category = require('../../models/category')

router.get('/stores/skip/:num',async(req,res,next)=>{
    let stores = []
    const cursor = User.find({subbed:true}).sort({'date':-1}).skip((req.params.num-1)*10).limit(10).cursor()
    for(let store = await cursor.next();store!=null; store = await cursor.next()){
        stores.push({userName:store.username})
    }
    cursor.close()
    for(let store of stores){
        let x = Categories.find().cursor()
        store.categories = []
        for(let categ = await x.next();categ!=null;categ = await x.next()){
            if(categ.users.indexOf(store.userName)!=-1)
                store.categories.push(categ.categoryName)
        }
    }
    res.json(stores)
})
router.get('/stores/countall',async(req,res,next)=>{
    User.countDocuments({subbed:true},(err,count)=>{
        res.json({count:count})
    })
})


router.get('/',async (req,res,next)=>{
    let cats = []
    const cursor = Categories.find().cursor()
    console.log('asd')
    for (let cat = await cursor.next();cat!=null;cat=await cursor.next()){
        cats.push(cat)
    }
    
    res.json(cats)
})

router.get('/countall',async (req,res,next)=>{
     Categories.countDocuments((err,count)=>{
        res.json({count:count})
    })
})
    
router.get('/skip/:num',async (req,res,next)=>{
    let numb = req.params.num - 1
    let cats = []
    const cursor = Categories.find().sort({'date':-1}).skip(numb*10).limit(10).cursor()
    console.log(numb)
    for (let cat = await cursor.next();cat!=null;cat=await cursor.next()){
        cats.push(cat.categoryName)
    }
    
    res.json(cats)
})

router.get('/:userName',async (req,res,next)=>{
    let {userName} = req.params

    let cats = []
    const cursor = Categories.find().cursor()
    console.log('asd')
    for (let cat = await cursor.next();cat!=null;cat=await cursor.next()){
        console.log(cat)
        if(cat.users.indexOf(userName)!=-1)
            cats.push(cat.categoryName)
    }
    
    res.json(cats)
})

router.get('/search/:query',async (req,res,next)=>{
    let {query} = req.params

    let cats = []
    const cursor = Categories.find({"categoryName":{"$regex":query,"$options":"i"}}).sort({'date':-1}).limit(10).cursor()
    for (let cat = await cursor.next();cat!=null;cat=await cursor.next()){
        cats.push(cat.categoryName)
    }
    
    res.json(cats)
})

router.get('/search/one/:query',async (req,res,next)=>{
    let {query} = req.params

    let cats = []
    const cursor = Categories.find({"categoryName":query}).sort({'date':-1}).limit(10).cursor()
    for (let cat = await cursor.next();cat!=null;cat=await cursor.next()){
        cats.push(cat.categoryName)
    }
    
    res.json(cats)
})

// router.get('/:categoryName',async (req,res,next)=>{
//     let {categoryName} = req.params
//     Categories.findOne({categoryName}).then(category=>{
//         res.json(category)
//     }).catch(err=>{
//         res.json({msg:'No stuch category.'})
//     })
//     // let cats = []
//     // const cursor = Categories.find({userName:userName}).cursor()
//     // console.log('asd')
//     // for (let cat = await cursor.next();cat!=null;cat=await cursor.next()){
//     //     cats.push(cat)
//     // }
    
// })



router.post('/' ,auth,(req,res,next)=>{
    let {userName,categoryName} = req.body
    // Categories.findOne({categoryName:categoryName}).then(category=>{
    //     if(category)
    //         return res.json({msg:'That category already exists.',category})
    // })

    const newCategory = new Categories({
        categoryName,
        users:[userName]
    })
    newCategory.save().then((category)=>{
        res.json({msg:'OK'})
    }).catch(err=>{
        res.json({msg:'That category already exists.'})
    })
})

router.put('/',auth, (req,res,next)=>{
    let {userName, categoryName} = req.body;
    
    Categories.findOneAndUpdate({categoryName},{
        $push:{users:userName}
    }).then(response=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json(err)
    })
    // res.json({msg:'OK'})
})
// router.delete('/:categoryName',auth ,(req,res,next)=>{
//     let {categoryName} = req.params
// })

module.exports = router;