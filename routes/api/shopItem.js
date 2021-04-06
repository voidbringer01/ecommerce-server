// const { response } = require('express')
const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const ShopItem = require('../../models/shopItem')

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb) =>{
        cb(null, file.fieldname + - + Date.now()+'.png')
    }
})

const upload = multer({storage:storage})
// const category = require('../../models/category')
router.get('/name/:id',async (req,res,next)=>{
    ShopItem.findOne({_id:req.params.id}).then(item=>{
        console.log(item)
        return res.json({name:item.itemTitle})
    })
    // for (let item = await cursor.next();item!=null;item=await cursor.next()){
    //     item.image = null
    //     console.log(item)
    //     items.push(item)
    // }
    
    // res.json(items)
})
router.get('/id/:id',async (req,res,next)=>{
    let items = []
    ShopItem.findOne({_id:req.params.id}).then(item=>{
        let x = item;
        console.log(x)
        x.json = null
        return res.json(x)
    })
    // for (let item = await cursor.next();item!=null;item=await cursor.next()){
    //     item.image = null
    //     console.log(item)
    //     items.push(item)
    // }
    
    // res.json(items)
})

router.get('/:userName',async (req,res,next)=>{
    let items = []
    const cursor = ShopItem.find({userName:req.params.userName}).cursor()
    for (let item = await cursor.next();item!=null;item=await cursor.next()){
        item.image = null
        items.push(item)
    }
    
    res.json(items)
})
router.get('/category/:catName',async (req,res,next)=>{
    let items = []
    const cursor = ShopItem.find({category:req.params.catName}).cursor()
    for (let item = await cursor.next();item!=null;item=await cursor.next()){
        // item.image = null
        items.push(item)
    }
    
    res.json(items)
})

router.get('/count/:catName/:skipuser',async (req,res,next)=>{
    
    const cursor = ShopItem.countDocuments({category:req.params.catName,userName:{$ne:req.params.skipuser}},(err,count)=>{
        console.log(count)
        res.json({count:count})
    })
})

router.get('/count/:catName',async (req,res,next)=>{
    
    const cursor = ShopItem.countDocuments({category:req.params.catName},(err,count)=>{
        console.log(count)
        res.json({count:count})
    })
})

// router.get('/:userName/image/:title',async (req,res,next)=>{
//     // let items = []
//     const cursor = ShopItem.find({userName:req.params.userName,itemTitle:req.params.title}).cursor()
//     for (let item = await cursor.next();item!=null;item=await cursor.next()){
//         // items.push({image:item.image})
//         res.json(item.image)
//     }
    
//     // res.json(items)
// })

// router.get('/:userName',async (req,res,next)=>{
//     let {userName} = req.params

//     let cats = []
//     const cursor = Categories.find().cursor()
//     console.log('asd')
//     for (let cat = await cursor.next();cat!=null;cat=await cursor.next()){
//         console.log(cat)
//         if(cat.users.indexOf(userName)!=-1)
//             cats.push(cat.categoryName)
//     }
    
//     res.json(cats)
// })

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



router.post('/',upload.single('image'),(req,res,next)=>{
    let imageName = req.body.imageName
    console.log(req.body)
    let img = {
        data: fs.readFileSync(path.join(__dirname + '../../../uploads/' + req.file.filename)),
        contentType:'image/png'
    }
    let userName = req.body.userName
    let itemTitle = req.body.itemTitle
    let smallDescription = req.body.smallDescription
    let description = req.body.description
    let price = req.body.price
    let suppliesLeft = req.body.suppliesLeft
    let category = req.body.category

    const shopItem = new ShopItem({
        image:img,
        imageName:imageName,
        userName:userName,
        itemTitle:itemTitle,
        smallDescription:smallDescription,
        description:description,
        price:price,
        suppliesLeft:suppliesLeft,
        category:category,
        imageUrl:req.file.filename
    })

    shopItem.save().then(item=>{
        res.json({msg:'OK'})
    }).catch(err=>{
        res.json({msg:err})
    })

})

router.delete('/:id',(req,res,next)=>{
    ShopItem.findOneAndDelete({_id:req.params.id}).then(res=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json({msg:err})
    })
})

router.put('/:id/:image',(req,res,next)=>{
    res.json({msg:'To be made'})
})
router.put('/:id/itemTitle/:itemTitle', (req,res,next)=>{
    console.log('ASD')
  
    ShopItem.findOneAndUpdate({_id:req.params.id},{
        itemTitle:req.params.itemTitle
    }).then(res=>{  
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json({msg:err})
    })
})

router.put('/:id/smallDescription/:smallDescription', (req,res,next)=>{
  
    ShopItem.findOneAndUpdate({_id:req.params.id},{
        smallDescription:req.params.smallDescription
    }).then(res=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json(err)
    })
})

router.put('/:id/description/:description', (req,res,next)=>{
  
    ShopItem.findOneAndUpdate({_id:req.params.id},{
        description:req.params.description
    }).then(res=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json(err)
    })
})
router.put('/:id/price/:price', (req,res,next)=>{
  
    ShopItem.findOneAndUpdate({_id:req.params.id},{
        price:req.params.price
    }).then(res=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json(err)
    })
})
router.put('/:id/suppliesleft/:suppliesleft', (req,res,next)=>{
  
    ShopItem.findOneAndUpdate({_id:req.params.id},{
        suppliesLeft:req.params.suppliesleft
    }).then(res=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json(err)
    })
})
router.put('/:id/category/:category', (req,res,next)=>{
  
    ShopItem.findOneAndUpdate({_id:req.params.id},{
        category:req.params.category
    }).then(res=>{
        return res.json({msg:'OK'})
    }).catch(err=>{
        return res.json(err)
    })
})
// router.delete('/:categoryName',auth ,(req,res,next)=>{
//     let {categoryName} = req.params
// })

module.exports = router;