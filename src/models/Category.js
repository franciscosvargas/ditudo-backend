const mongoose = require('mongoose')

const Category = new mongoose.Schema(
    {
        name: { type: String, require: true },
        image: { type: String, require: true}
    }
)

module.exports = mongoose.model('Category', Category)