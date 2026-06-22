const express = require('express')
const items = require("../controller/item_uom.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', items.list);
router.get('/dropdown-list', items.DropDownList);
router.post('/store', items.store);
router.post('/update', items.update);
router.post('/details', items.details);
router.post('/delete', items.delete_uom);


module.exports = router;
