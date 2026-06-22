const express = require('express')
const items = require("../controller/collection.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()
router.post('/list', items.list);
router.post('/add', items.store);
router.post('/delete', items.delete_collection);
router.post('/details', items.details);
router.post('/update', items.UpdateCollection);
router.post('/collection_status_update', items.collection_status_update);


module.exports = router;
