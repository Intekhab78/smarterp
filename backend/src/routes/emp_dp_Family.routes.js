// routes/empFamilyRoutes.js
const express = require("express");
const router = express.Router();
const empFamilyController = require("../controller/emp_dp_Family.controller");

// CRUD Endpoints
router.post("/store", empFamilyController.createFamily);
router.get("/list", empFamilyController.getAllFamilies);
router.get("/details:id", empFamilyController.getFamilyById);
router.put("/update:id", empFamilyController.updateFamily);
router.delete("/delete:id", empFamilyController.deleteFamily);

module.exports = router;
