const ProductModel = require('../models/Product')
const CartModel = require('../models/Chat')
const fs = require('fs')
const sharp = require('sharp')

class Product {

    async createNewProduct(req, res) {
        req.body.loc = { type: "Point", coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]}
		
		req.body.owner = req.userId
		if(req.file) {
			req.body.image = `http://35.222.105.40:3001/${req.file.path}`

        	//await fs.unlink(req.file.path, () => { })
		}

        const newProduct = await ProductModel.create(req.body)

        return res.json(newProduct)
    }

    async findById(req, res) {
        const search = await ProductModel.findById(req.userId).populate('owner')

        return res.json(search)
    }

    async findByOwner(req, res) {
        const search = await ProductModel.find({ 'owner': req.userId }).populate('owner')

        return res.json(search)
    }

    async searchByKeyword(req, res) {
		var regex = new RegExp(req.query.keyword, 'i')
		//$or: [{ name: regex }], 

		const { latitude, longitude } = req.query

		const coords = {
			latitude: parseFloat(latitude),
			longitude: parseFloat(longitude)
		}

		//const search = await ProductModel.find(criteria).populate('owner')

		const search = await ProductModel.aggregate([
			{
			  $geoNear: {
				 near: { type: "Point", coordinates: [ coords.longitude , coords.latitude ] },
				 key: 'loc',
				 distanceField: "dist",
				 spherical: true,
				 
			  }
			},
			{$sort: {price:1, dist:1, }},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "owner"
				}
			},
			{"$unwind": {
				"path": "$owner",
				"preserveNullAndEmptyArrays": true
			}
		},
			
		])
		
		//search.owner = owner
		
        return res.json(search)
    }

    async deleteProduct(req, res) { 
        const search = await ProductModel.findOneAndRemove({ '_id': req.body.id, 'owner': req.userId })
        await CartModel.find({ 'product': req.body.id }).deleteMany().exec()

        return res.send(search)
    }

    async getOthersProducts(req, res) {
		const products = await ProductModel.find({ _id: { $ne: req.query.id }, 'owner': req.query.owner }).populate('owner').limit(20)
        return res.json(products)
    }

    
}

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0
    }
    else {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
        if (dist > 1) {
            dist = 1
        }
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist
    }
}
module.exports = new Product()