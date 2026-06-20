const express = require('express')
const items = require("../controller/pos_payment.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', items.list);
router.post('/add', items.store);
router.post('/update', items.update);
router.post('/details', items.details);
router.post('/delete', items.delete_pos);


module.exports = router;
