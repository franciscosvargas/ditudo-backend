const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        name: {type: String, require: true},
        email: {type: String, require: true},
        password: {type: String, require: true},
        location: {type: [Number], index: '2d'},
        phone: {type: String},
        image: {type: String}
    }
)

module.exports = mongoose.model('User', User)