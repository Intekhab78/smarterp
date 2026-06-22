const express = require("express");
const router = express.Router();
const {
  fetchTrainDetails,
} = require("../../../controller/Trip/controller/trainController");

// Route: GET /api/train/:trainNumber
router.get("/train/:trainNumber", fetchTrainDetails);

module.exports = router;
