const express = require("express");
const items = require("../controller/items.controller");
const Auth = require("../middleware/Auth");
// const { upload, uploadFile } = require("../middleware/UploadFile"); //i change this from below
const { upload, uploadFile } = require("../UploadFile"); //may be it can create issue to generate barcode but usefull in send the image in itemsImage folder only issue is from the above upload file that bstore in middleware it store the image outsdie the itemsImage folder

const router = new express.Router();

router.post("/list", items.list);
router.get("/dropdown-list", items.DropDownList);
router.post("/store", upload.single("item_image"), items.store);
router.post("/update", upload.single("item_image"), items.update);
router.post("/details", items.details);
router.post("/itemcode_details", items.itemcode_details);
router.post("/delete", items.delete_item);
router.post("/pagination_list", items.getItemByPagination);

router.post("/store-bulk", items.storeBulk);

module.exports = router;
