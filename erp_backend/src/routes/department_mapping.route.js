// const express = require("express");
// const router = express.Router();
// const departmentMappingController = require("../controller/department_mapping.controller");

// router.post("/save", departmentMappingController.createOrUpdateMapping);
// router.post("/save-bulk", departmentMappingController.saveBulkMappings);
// router.get("/list", departmentMappingController.getMappings);

// module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();
const departmentMappingController = require("../controller/department_mapping.controller");

// Create or Update mapping
router.post("/save", departmentMappingController.createOrUpdateMapping);

// Bulk save mappings (create/update)
router.post("/save_bulk", departmentMappingController.saveBulkMappings);

// Get list of mappings (with filters via query params)
router.get("/list", departmentMappingController.getMappings);

module.exports = router;
