const express = require("express");
const router = express.Router();
const taxSettingsController = require("../controller/taxSettings.controller");

// POST → create tax setting
router.post("/tax-store", taxSettingsController.createTaxSetting);

// GET → fetch all tax settings
router.get("/tax-list", taxSettingsController.getAllTaxSettings);
router.put("/tax_setting_update/:id", taxSettingsController.updateTaxSetting);
// PUT → update tax status
router.put("/tax_setting_status", taxSettingsController.updateTaxSettingStatus);

module.exports = router;
