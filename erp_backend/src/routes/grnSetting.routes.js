const express = require("express");
const router = express.Router();
const controller = require("../controller/grnSetting.controller");

router.post("/create", controller.createSetting);
router.get("/list", controller.getAllSettings);
router.get("/details:id", controller.getSettingById);
router.put("/update:id", controller.updateSetting);
router.delete("/delete:id", controller.deleteSetting);

module.exports = router;
