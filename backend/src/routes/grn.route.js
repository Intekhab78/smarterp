const express = require("express");
const items = require("../controller/grn.controller");
const Auth = require("../middleware/Auth");
const { upload, uploadFile } = require("../middleware/UploadFile");

const router = new express.Router();

router.post("/list", items.list);
router.post("/add", items.store);
router.post("/details", items.Grndetails);
router.post("/update", items.UpdateGrn);
router.post("/update1", items.UpdateGrn4);
router.post("/manualinsert", items.manualgrn);

module.exports = router;
