const express = require("express");
const router = express.Router();
const subFamilyController = require("../controller/emp_sub_Family.controller");

// Create Sub Family
router.post("/store", subFamilyController.createSubFamily);

// Get all Sub Families
router.get("/list", subFamilyController.getAllSubFamilies);

// Get single Sub Family by ID
router.get("/details:id", subFamilyController.getSubFamilyById);

// Update Sub Family
router.put("/updete:id", subFamilyController.updateSubFamily);

// Delete Sub Family
router.delete("/delete:id", subFamilyController.deleteSubFamily);

module.exports = router;
