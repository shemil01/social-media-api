const express = require('express')
const controller = require('../controller/userForm')
const { tryCatch } = require('../utils/tryCatch')
const userAuth = require('../middleware/userAuth')
const router = express.Router()

router.post('/register',tryCatch(controller.userRegister))
router.post('/login',tryCatch(controller.userLogin))
router.delete('/logout',userAuth,tryCatch(controller.logout))
router.get('/profail',userAuth,tryCatch(controller.viewProfail))

module.exports = router