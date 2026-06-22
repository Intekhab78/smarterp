"use strict";

const express = require("express");
const router = express.Router();
const { upload, uploadFile } = require("../UploadFile");
const videoAdvertiesmentController = require("../controller/video_advertiesment.controller");

/**
 * VIDEO ADVERTISEMENT ROUTES
 */

// Create video advertisement
router.post(
  "/create",
  upload.single("video"),
  videoAdvertiesmentController.createVideoAdvertiesment
);

// Get all ads by store (Admin / Dashboard)
router.get("/store/:store_id", videoAdvertiesmentController.getAdsByStore);
router.get("/list", videoAdvertiesmentController.getAllAds);

// Get active ads by location (TV / Player)
router.get(
  "/location/:location_id",
  videoAdvertiesmentController.getActiveAdsByLocation
);

// Update video advertisement details
router.put("/:id", videoAdvertiesmentController.updateVideoAdvertiesment);

// Update advertisement status (pause / resume)
router.patch("/:id/status", videoAdvertiesmentController.updateAdStatus);

// Soft delete video advertisement
router.delete("/:id", videoAdvertiesmentController.deleteVideoAdvertiesment);

module.exports = router;
