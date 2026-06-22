const express = require("express");
const items = require("../controller/batch.controller");
const Auth = require("../middleware/Auth");
const { upload, uploadFile } = require("../middleware/UploadFile");

const router = new express.Router();

router.post("/list", items.list);
router.post("/store", items.store);
router.post("/update", items.update);
router.post("/details", items.details);
router.post("/delete", items.delete_batch);
router.post("/stock-adjustment", items.increaseStockAdjustment);

module.exports = router;
