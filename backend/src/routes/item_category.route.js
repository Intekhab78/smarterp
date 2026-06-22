const express = require('express')
const items = require("../controller/item_category.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', items.list);
router.get('/dropdown-list', items.DropDownlist);
router.post('/cat_item_list', items.cat_item_list);
router.post('/store', items.store);
router.post('/update', items.update);
router.post('/details', items.details);
router.post('/delete', items.delete_item_category);


module.exports = router;
