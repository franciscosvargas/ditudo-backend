
const ChatModel = require('../models/Chat')
const ProductModel = require('../models/Product')

class Chat {
    async createNewChat(req, res) {
        const product = await ProductModel.findById(req.body.id)
        const chatDetails = {
            product: product._id,
            owner: product.owner,
            buyer: req.userId,
            messages: []
        }

        const chat = await chatExists(chatDetails)
        if (chat) return res.json(chat)

        const newChat = await ChatModel.create(chatDetails)
        newChat.product = product
        return res.json(newChat)
    }

    async findChats(req, res) {
        const chats = await ChatModel.find({ 'buyer': req.userId }).populate('product')
        return res.json(chats)
    }

    async registerSocket(query, socket) {
        const chat = await ChatModel.findById(query.chat)

        if (query.iam == chat.buyer) {
            chat.socketBuyer = socket
        } else if (query.iam == chat.owner) {
            chat.socketOwner = socket
        }

        chat.save()
        return chat
    }

    async newMessage(message, io) {
        const chat = await ChatModel.findById(message.chat)

        const newMessage = {
            author: message.author,
            message: message.message
        }

        chat.messages.push(newMessage)

        chat.save()

        io.to(chat.socketBuyer).emit('receiveMessage', newMessage)
        io.to(chat.socketOwner).emit('receiveMessage', newMessage)
        return chat
    }

    async getMessages({ chat }, socket) {
        const chatDetails = await ChatModel.findById(chat)
        return socket.emit('oldMessages', chatDetails.messages)
    }
}

async function chatExists({ product, owner, buyer }) {
    const chat = await ChatModel.findOne({ product, owner, buyer }).populate('product')
    return chat

}
module.exports = new Chat()
