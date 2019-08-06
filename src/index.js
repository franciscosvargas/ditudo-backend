const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const app = express()

mongoose.connect('mongodb+srv://backend:backendawon@principal-sv9tu.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true})

app.use(express.json())
app.use(routes)

// Abrindo servidor na porta padrão ou na porta 3001
app.listen(process.env.PORT || 3001)