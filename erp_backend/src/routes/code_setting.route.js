const express = require('express')
const items = require("../controller/code_Setting.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/get-next-comming-code', Auth, items.getNextComingCode2);


module.exports = router;
