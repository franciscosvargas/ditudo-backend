const express = require('express')
const router = express.Router()

const Auth = require('./controllers/auth')
const Product = require('./controllers/product')

router.post('/register', Auth.registerUser)
router.post('/auth', Auth.mobileAuthentication)

router.get('/product/searchbyid', Product.findById)
router.get('/product/search', Product.searchByKeyword)

router.post('/product', Product.createNewProduct)
router.put('/product', Product.createNewProduct)

module.exports = router