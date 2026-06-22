const express = require("express");
const router = express.Router();

const controller = require("../controller/filterCompItemSetting.controller");

// Save settings (multiple rows)
router.post("/save", controller.saveSettings);

// Fetch all saved settings
router.get("/list", controller.getSettings);

// Delete one setting row
router.delete("/delete/:id", controller.deleteSetting);

module.exports = router;
