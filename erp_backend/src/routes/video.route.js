// routes/system.js

const express = require("express");
const router = express.Router();
const {
  playTestAd,
  stopAd,
  playAdById,
} = require("../controller/video.controller");

// Route to play test ad
router.get("/play-test", playTestAd);
// Stop ad
// router.get("/stop", stopAd);

router.post("/:id/play", playAdById);
router.post("/stop", stopAd);

module.exports = router;
