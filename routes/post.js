const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .sort({date:-1})
    .populate("postedBy", "_id name")
    .then(posts=>{
        res.json({posts}) 
    })
    .catch(error=>{
        console.log(error)
    })
})

router.post('/createpost',requireLogin,(req, res)=>{
    const {title,body,photo} = req.body
    if(!title || !body || !photo){
        return res.status(404).json({error:"Pleas fill out all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(error=>{
        console.log(error)
    })
})

// router.get('/mypost',requireLogin,(req,res)=>{
//     Post.find({postedBy:req.user._id})
//     .populate("postedBy","_id name")
//     .then(mypost=>{
//         res.json({mypost})
//     })
//     .catch(error=>{
//         console.log(error)
//     })
// })

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((error,post)=>{
        if(error || !post){
            return res.status(401).json({error:error})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(error=>{
                console.log(error)
            })
        }
    })
})

router.put('/like', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy", "_id name")
    .exec((error,result)=>{
        if(error){
            return res.status(400).json({error:error})
        }else{
            res.json(result)
        }
    })
    
})

router.put('/unlike', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy", "_id name")
    .exec((error,result)=>{
        if(error){
            return res.status(400).json({error:error})
        }else{
            res.json(result)
        }
    })
    
})



module.exports = router