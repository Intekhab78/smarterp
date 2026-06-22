const express = require('express')
const user = require("../controller/user_user_master.controller")
const { upload, uploadFile } = require("../middleware/UploadFile")
const Auth = require("../middleware/Auth")


const router = new express.Router()

router.post('/list',user.list);
router.post('/store',user.store);
router.post('/update',user.update);
router.post('/details',user.details);
router.post('/delete',user.delete_user);


//web
module.exports = router;