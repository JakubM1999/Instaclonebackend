const { json } = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 5001
const {db} = require('./database/db')




mongoose.connect(db),{
    useNewUrlParser: true,
    useUnifiedTypology: true
}
mongoose.connection.on('connected',()=>{
    console.log("You are connected to database")
})

mongoose.connection.on('error',(error)=>{
    console.log("error connection",error)
})

require('./models/user')
require('./models/post')

app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})