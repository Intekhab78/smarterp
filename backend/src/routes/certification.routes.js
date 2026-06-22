const express = require("express");
const router = express.Router();
// const { upload } = require("../middleware/UploadFile");
const { upload } = require("../UploadFile"); // <-- your dynamic folder multer

const certificationController = require("../controller/certification.controller");

// ✅ Create new certification
router.post(
  "/create",
  upload.single("certificationFile"),
  certificationController.create
);

// ✅ Get all certifications for an employee
router.get("/:emp_id", certificationController.findByEmployee);

// ✅ Update existing certification
router.put(
  "/update/:id",
  upload.single("certificationFile"),
  certificationController.update
);

// ✅ Delete certification
router.delete("/delete/:id", certificationController.delete);

module.exports = router;
