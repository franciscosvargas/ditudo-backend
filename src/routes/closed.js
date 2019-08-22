const express = require('express')
const router = express.Router()
const multer = require('multer')

const jwt = require('jsonwebtoken')
const credentials = require('../credentials.json')

const Product = require('../controllers/product')
const Chat = require('../controllers/chat')

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'uploads')
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    },
})

const upload = multer({ storage })


router.use((req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader)
        res.status(401).send({ error: 'Nenhum token foi informado.' })

    const parts = authHeader.split(' ')

    if (!parts.length === 2)
        res.status(401).send({ error: 'Token com formato inválido' })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token mal formatado.' })

    jwt.verify(token, credentials.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token inválido.' })

        req.userId = decoded.id
        return next()
    })


})

router.get('/product/searchbyid', Product.findById)
router.get('/product/getByOwner', Product.findByOwner)
router.get('/product/search', Product.searchByKeyword)

router.post('/product', upload.single('image'), Product.createNewProduct)
router.put('/product', Product.createNewProduct)
router.delete('/product', Product.deleteProduct)


router.get('/chat', Chat.findChats)
router.post('/chat', Chat.createNewChat)

module.exports = router