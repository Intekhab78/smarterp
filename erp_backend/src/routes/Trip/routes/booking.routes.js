const express = require("express");
const router = new express.Router();

const BookingController = require("../../../Trip/controller/booking.controller");

// Booking routes
router.post("/create", BookingController.createBooking);
router.post("/user-bookings", BookingController.getBookingsByUser); // If you're using POST with body

module.exports = router;
