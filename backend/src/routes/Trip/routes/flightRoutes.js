const express = require("express");
const router = express.Router();
const {
  getFlightSuggestions,
} = require("../../../controller/Trip/controller/flightController");
const {
  searchOneWayFlight,
} = require("../../../controller/Trip/controller/flightController");

router.get("/autocomplete", getFlightSuggestions);
router.get("/search-one-way", searchOneWayFlight);

module.exports = router;
