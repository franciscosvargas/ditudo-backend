const ProductModel = require('../models/Product')

class Product {
    
    async createNewProduct(req, res) {
        const newProduct = await ProductModel.create(req.body)

        return res.json(newProduct)
    }

    async findById(req, res) {
        const search = await ProductModel.findById(req.query.id).populate('owner')

        return res.json(search)
    }

    async searchByKeyword(req, res) {
        var regex = new RegExp(req.query.keyword, 'i')
		var criteria = { $or: [{ name: regex }, { description: regex }] }
        const search = await ProductModel.find(criteria)

        return res.json(search)
    }
}

module.exports = new Product()