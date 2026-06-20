const express = require("express");
const router = express.Router();
const orderTrackingController = require("../controller/order_tracking.controller");

// Create a new tracking
router.post("/create", orderTrackingController.createTracking);

// Get all tracking records
router.get("/list", orderTrackingController.getAllTrackings);

// Get tracking by ID
router.get("detail/:id", orderTrackingController.getTrackingById);

// Update tracking by ID
router.put("update/:id", orderTrackingController.updateTracking);

// Delete tracking by ID
router.delete("delete/:id", orderTrackingController.deleteTracking);

module.exports = router;
