const express = require('express')
const controller = require('../controller/authCntroller')
const { tryCatch } = require('../utils/tryCatch')
const userAuth = require('../middleware/userAuth')
const router = express.Router()

router.post('/register',tryCatch(controller.userRegister))
router.post('/login',tryCatch(controller.userLogin))
router.delete('/logout',userAuth,tryCatch(controller.logout))


module.exports = router