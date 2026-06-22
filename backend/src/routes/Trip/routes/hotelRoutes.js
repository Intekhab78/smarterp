const express = require("express");
const router = express.Router();

const {
  fetchStatus,
  fetchHotelList,
  fetchBookingHotels, // ✅ make sure this is imported
  fetchHotelByDestination,
  fetchHotelDetails,
} = require("../../../controller/Trip/controller/hotelController");

router.get("/status", fetchStatus);
router.get("/hotels", fetchHotelList);
router.get("/gethotel", fetchBookingHotels); // ✅ This was missing or incorrectly defined
router.get("/searchhotels", fetchHotelByDestination); // ✅ This was missing or incorrectly defined
router.get("/hotel_details", fetchHotelDetails);

module.exports = router;
