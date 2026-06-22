const express = require('express')
const { list, store, list_p, list_details, image_remove,update } = require("../controller/portfolio_category.controller")
const Auth = require("../middleware/Auth")
const { upload, uploadFile } = require("../middleware/UploadFile")



const router = new express.Router()

router.post('/list', list);
router.post('/store', upload.array('images'), store);
router.post('/update', upload.array('images'), update);
router.post('/portfolio-list', list_p);
router.post('/details', list_details);
router.post('/image-remove', image_remove);


module.exports = router;
