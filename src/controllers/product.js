const ProductModel = require('../models/Product')
const CartModel = require('../models/Chat')
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
        
        return res.json(newProduct)
    }

    async findById(req, res) {
        const search = await ProductModel.findById(req.userId).populate('owner')

        return res.json(search)
    }

    async findByOwner(req, res) {
        const search = await ProductModel.find({'owner': req.userId}).populate('owner')

        return res.json(search)
    }

    async searchByKeyword(req, res) {
        var regex = new RegExp(req.query.keyword, 'i')
        var criteria = { $or: [{ name: regex }] }
        const search = await ProductModel.find(criteria).populate('owner').sort({'price': 1})


        return res.json(search)
    }

    async deleteProduct(req, res) {
        const search = await ProductModel.findOneAndRemove({'_id':req.body.id, 'owner': req.userId})
        await CartModel.find({'product':req.body.id}).deleteMany().exec()

        return res.send(search)
    }

    async getOthersProducts(req, res) {
        const products = await ProductModel.find({ _id: {$ne: req.query.id}, 'owner': req.query.owner}).populate('owner')
        
        return res.json(products)
    }
}

module.exports = new Product()