const express = require("express");
const items = require("../controller/company.controller");
const Auth = require("../middleware/Auth");
const { upload, uploadFile } = require("../middleware/UploadFile");

const router = new express.Router();

router.post("/list", items.list);
router.post("/com_list", items.com_list);
router.post("/user_matched_com_list", items.user_matched_com_list);
router.post("/store", items.store);
router.post("/update", items.update);
router.post("/details", items.details);
router.post("/delete", items.delete_uom);

module.exports = router;
