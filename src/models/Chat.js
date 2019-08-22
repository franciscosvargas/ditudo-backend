const mongoose = require('mongoose')

const Chat = new mongoose.Schema(
    {
        messages: { type: Array },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        socketBuyer: { type: 'String' },
        socketOwner: { type: 'String' }
    }
)

module.exports = mongoose.model('Chat', Chat)