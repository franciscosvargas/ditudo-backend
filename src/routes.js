const express = require('express')
const router = express.Router()
const Auth = require('./controllers/auth')


router.post('/register', Auth.registerUser)
router.post('/auth', Auth.mobileAuthentication)

module.exports = router