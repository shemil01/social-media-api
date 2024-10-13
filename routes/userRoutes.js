const express = require('express')
const controller = require('../controller/userForm')
const { tryCatch } = require("../utils/tryCatch");
const userAuth = require("../middleware/userAuth");
const {uploadImage} = require('../middleware/upload')
const router = express.Router();


// get profail
router.get("/profail", userAuth, tryCatch(controller.viewProfail));
router.put("/edit/profail", uploadImage,userAuth, tryCatch(controller.editProfail));

module.exports = router