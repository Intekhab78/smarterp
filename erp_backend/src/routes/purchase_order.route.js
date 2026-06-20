const express = require('express')
const items = require("../controller/purchase_order.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', items.list);
router.post('/store', items.store);
router.post('/delete', items.delete_order);
router.post('/details', items.details);
router.post('/update', items.UpdateOrder);


module.exports = router;
