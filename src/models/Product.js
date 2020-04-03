const mongoose = require('mongoose')


const Product = new mongoose.Schema(
    {
        name: { type: String, require: true },
        price: { type: Number, require: true },
        description: { type: String},
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        loc: {type: {}, coordinates: [Number]},
        image: {type: String}
    }
)

Product.index({loc:'2dsphere'});

module.exports = mongoose.model('Product', Product)