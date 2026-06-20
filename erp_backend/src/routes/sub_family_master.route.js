const express = require('express')
const items = require("../controller/sub_family_master.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', items.list);
router.get('/dropdown-list', items.DropDownlist);
router.post('/by_id_list', items.by_id_list);
router.post('/store', items.store);
router.post('/update', items.update);
router.post('/details', items.details);
router.post('/delete', items.delete_sub_family);


module.exports = router;
