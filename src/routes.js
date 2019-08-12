const express = require('express')
const router = express.Router()

const Auth = require('./controllers/auth')
const Product = require('./controllers/product')

router.post('/register', Auth.registerUser)
router.post('/auth', Auth.mobileAuthentication)
router.post('/product/insert', Product.createNewProduct)
router.get('/product/searchbyid', Product.findById)
router.get('/product/search', Product.searchByKeyword)

module.exports = router