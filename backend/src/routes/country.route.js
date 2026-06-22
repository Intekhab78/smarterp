const express = require('express')
const { list, listdropdown, store, update, list_delete,details } = require("../controller/countryMaster.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', list);
router.get('/list-dropdown', Auth, listdropdown);
router.post('/store', Auth, store);
router.post('/update', Auth, update);
router.post('/delete', Auth, list_delete);
router.post('/details', Auth, details);


module.exports = router;
