// const db = require("../models/booking"); // Adjust path if needed
// const db = require("../models"); // ✅ loads all models
const db = require("../../models"); // ✅ go up twice to reach src/models

const Booking = db.Booking;

// ✅ Create a booking
const createBooking = async (req, res) => {
  try {
    const { userId, flight } = req.body;

    if (!userId || !flight) {
      return res.status(400).json({ message: "Missing user or flight data." });
    }

    const {
      airline,
      flightNumber,
      fromAirport,
      toAirport,
      departure,
      arrival,
      cabinClass,
      price,
    } = flight;

    const newBooking = await Booking.create({
      userId,
      vehicleType: "flight", // hardcoded here since it's flight
      vehicleNumber: flightNumber,
      fromLocation: fromAirport,
      toLocation: toAirport,
      departureTime: departure,
      arrivalTime: arrival,
      classType: cabinClass,
      price,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: "Failed to create booking." });
  }
};

// ✅ Get bookings for a specific user
const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const bookings = await Booking.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

module.exports = { createBooking, getBookingsByUser };
