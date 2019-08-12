const mongoose = require('mongoose')


const Product = new mongoose.Schema(
    {
        name: { type: String, require: true },
        price: { type: Number, require: true },
        description: { type: String},
        location: {type: Object, require: true},
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
)

module.exports = mongoose.model('Product', Product)