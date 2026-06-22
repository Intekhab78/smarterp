const express = require('express')
const roles = require("../controller/roles.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/store', roles.Insert);
router.post('/list', roles.list);
router.post('/update', roles.Update);
router.post('/details', roles.getroleById);
router.post('/delete', roles.delete_role);


module.exports = router;
