// Importing the controller
const express = require("express");
const router = express.Router();
const functionActionMasterMapController = require("../controller/function_action_master_map.controller"); // Import the controller

// Route for getting the function-action mappings
router.get("/list", functionActionMasterMapController.getFunctionActionMasterMaps);

module.exports = router;
