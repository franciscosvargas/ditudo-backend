const ProductModel = require('../models/Product')
const fs = require('fs')
const sharp = require('sharp')

class Product {

    async createNewProduct(req, res) {
        req.body.location = {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }
        req.body.owner = req.userId
        await sharp(req.file.path)
            .rotate()
            .resize(400)
            .toBuffer()
            .then(buffer => { req.body.image = buffer.toString('base64') })

        await fs.unlink(req.file.path, () => {}) 

        const newProduct = await ProductModel.create(req.body)
        
        console.log(newProduct)
        return res.json(newProduct)
    }

    async findById(req, res) {
        const search = await ProductModel.findById(req.userId).populate('owner')

        return res.json(search)
    }

    async findByOwner(req, res) {
        const search = await ProductModel.find({'owner': req.userId})

        return res.json(search)
    }

    async searchByKeyword(req, res) {
        var regex = new RegExp(req.query.keyword, 'i')
        var criteria = { $or: [{ name: regex }] }
        const search = await ProductModel.find(criteria)

        return res.json(search)
    }

    async deleteProduct(req, res) {
        console.log(req.body)
        const search = await ProductModel.findOneAndRemove({'_id':req.body.id, 'owner': req.userId})
        return res.send(search)

    }
}

module.exports = new Product()