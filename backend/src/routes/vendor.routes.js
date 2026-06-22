const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendor.controller");
const multer = require("multer");
const path = require("path");
const { upload } = require("../UploadFile"); // <-- your dynamic folder multer

// CREATE Vendor
router.post(
  "/create",
  upload.fields([
    { name: "trade_license_upload", maxCount: 1 },
    { name: "tax_certificate", maxCount: 1 },
  ]),
  vendorController.createVendor
);

// LIST Vendors
router.post("/list", vendorController.listVendors);

// VIEW single Vendor
router.get("/view/:id", vendorController.viewVendor);

// UPDATE Vendor
router.post(
  "/update/:id",
  upload.fields([
    { name: "trade_license_upload", maxCount: 1 },
    { name: "tax_certificate", maxCount: 1 },
  ]),
  vendorController.updateVendor
);

// DELETE Vendor
router.delete("/delete/:id", vendorController.deleteVendor);

module.exports = router;
