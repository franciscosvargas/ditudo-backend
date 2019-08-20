const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const openRoutes = require('./routes/open')
const closedRoutes = require('./routes/closed')

const app = express()

mongoose.connect('mongodb+srv://backend:backendawon@principal-sv9tu.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.use(openRoutes)
app.use(closedRoutes)

// Abrindo servidor na porta padrão ou na porta 3001
app.listen(process.env.PORT || 3001)