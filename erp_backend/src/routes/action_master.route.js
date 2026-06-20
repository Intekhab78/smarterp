const express = require("express");
const actionMasterController = require("../controller/action_master.controller");
const router = new express.Router();

// Routes for action_master
router.get("/search", actionMasterController.search); // Search by name
router.post("/create", actionMasterController.create); // Create a new action
router.get("/list", actionMasterController.getAll); // Get all actions

module.exports = router;
