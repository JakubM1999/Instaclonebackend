const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT} = require('../database/db')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})

router.post('/signup',(req,res)=>{
   const {name,email,password} = req.body
   if(!email || !password || !name){
       return res.status(400).json({error: "please fill all the required fields"})
   }
   User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
            return res.status(400).json({error: "This email has already been taken"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User ({
                email,
                password:hashedpassword,
                name
            })
    
            user.save()
            .then(user => {
                res.json({message: "Registered successfully"})
            })
            .catch(error => {
                console.log(error)
            })
        })

   })
   .catch(error =>{
       console.log(error)
   })
})

router.post('/signin',(req, res)=>{
    const {email,password} = req.body
    if (!email || !password){
        return res.status(400).json({error: "Please write email or password"})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(400).json({error:"Incurrect email or password"})
        }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch =>{
        if(doMatch){
            // res.json({message:"Successfully signed in"})
            const token = jwt.sign({_id:savedUser._id}, JWT)
            const {_id,name,email} = savedUser
            res.json({token,user:{_id,name,email}})
        }
        else{
            return res.status(400).json({error:"Incurrect email or password"})
        }
    })
    .catch(error=>{
        console.log(error)
    })

    })
})

module.exports = router