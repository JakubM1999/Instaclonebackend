const jwt = require('jsonwebtoken')
const {JWT} = require('../database/db')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next) =>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT,(error,payload)=>{
        if(error){
            return res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
       
        
    })
}