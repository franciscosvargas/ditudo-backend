const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const openRoutes = require('./routes/open')
const closedRoutes = require('./routes/closed')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const Chat = require('./controllers/chat')

io.on('connection', socket => {
    const query = socket.handshake.query

    Chat.registerSocket(query, socket.id)
    Chat.getMessages(query, socket)
    
    socket.on('newMessage', async (message) => {
        await Chat.newMessage(message.newMessage, io)
    })
})

mongoose.connect('mongodb+srv://admin:admin@cluster0-lyfu1.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/uploads/:image', (req, res) => {
	res.sendFile(path.join(__dirname, `../uploads/${req.params.image}`));
})

app.use(openRoutes)
app.use(closedRoutes)



// Abrindo servidor na porta padrão ou na porta 3001
server.listen(process.env.PORT || 3001)