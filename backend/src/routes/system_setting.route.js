const express = require("express");
const controller = require("../controller/system_setting.controller");

const router = new express.Router();

// Get all settings for company + location
router.get("/get_setting/:companyId/:locationId", controller.getSettings);

// Create OR Update a setting
router.post("/update_setting/:companyId/:locationId", controller.updateSetting);

// Reset all settings
router.delete(
  "/delete_setting/:companyId/:locationId",
  controller.resetSettings
);

module.exports = router;
