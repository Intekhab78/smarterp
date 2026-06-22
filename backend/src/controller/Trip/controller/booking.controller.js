const db = require("../models"); // Adjust path if needed
const Booking = db.Booking;

// ✅ Create a booking
const createBooking = async (req, res) => {
  try {
    const {
      userId,
      vehicleType,
      vehicleNumber,
      fromLocation,
      toLocation,
      departureTime,
      arrivalTime,
      classType,
      price,
    } = req.body;

    // Basic validation
    if (
      !userId ||
      !vehicleType ||
      !vehicleNumber ||
      !fromLocation ||
      !toLocation
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newBooking = await Booking.create({
      userId,
      vehicleType,
      vehicleNumber,
      fromLocation,
      toLocation,
      departureTime,
      arrivalTime,
      classType,
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
