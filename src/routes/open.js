const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'uploads')
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    },
})

const upload = multer({ storage })

const Auth = require('../controllers/auth')

router.post('/register', upload.single('image'), Auth.registerUser)
router.post('/auth', Auth.mobileAuthentication)





module.exports = router