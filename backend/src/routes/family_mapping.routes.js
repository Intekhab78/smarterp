"use strict";

const express = require("express");
const router = express.Router();
const familyMappingController = require("../controller/family_mapping.controller");

// Create or Update single mapping
router.post("/save", familyMappingController.createOrUpdateMapping);

// Bulk save mappings
router.post("/save_bulk", familyMappingController.saveBulkMappings);

// Get list of mappings
router.get("/filtered_by_key_list", familyMappingController.getMappings);

module.exports = router;
