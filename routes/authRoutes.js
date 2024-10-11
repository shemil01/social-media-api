const express = require('express')
const controller = require('../controller/userForm')
const { tryCatch } = require('../utils/tryCatch')
const router = express.Router()

router.post('/register',tryCatch(controller.userRegister))
router.post('/login',tryCatch(controller.userLogin))

module.exports = router