const express = require('express')
const items = require("../controller/dashboard.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', items.list);


module.exports = router;
