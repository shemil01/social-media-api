const express = require('express')
const controller = require('../controller/friendRequest')
const userAuth = require('../middleware/userAuth')
const { tryCatch } = require('../utils/tryCatch')
const router  = express.Router()

//send friend request
router.post('/send',userAuth,tryCatch(controller.sendRequest))

// received  requests
router.get('/received',userAuth,tryCatch(controller.getReceivedRequest))

//accept friend request
router.post('/accept/:requestId',userAuth,tryCatch(controller.acceptRequest))

//reject friend request
router.post('/reject/:requestId',userAuth,tryCatch(controller.rejectRequest))

router.put('/remove-friend/:friendId',userAuth,tryCatch(controller.removeFriend))

module.exports = router;