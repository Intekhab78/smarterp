const express = require("express");
const router = express.Router();
const registerFloatController = require("../controller/register_tbl_hdr.controller");

// POST: Create/Register new float
router.post("/store", registerFloatController.createRegisterFloat);
router.get("/list", registerFloatController.listRegisterFloat); // (if implemented)
router.put("/close/:id", registerFloatController.closeRegisterFloat);
router.get("/details/:id", registerFloatController.getRegisterFloatById);
router.put("/update/:id", registerFloatController.updateRegisterFloat);
router.delete("/delete/:id", registerFloatController.deleteRegisterFloat);
// routes/register_float.routes.js
router.get("/registerSettingList", registerFloatController.getRegisterSetting);
router.post(
  "/registerSettingStore",
  registerFloatController.setRegisterSetting
);

module.exports = router;
