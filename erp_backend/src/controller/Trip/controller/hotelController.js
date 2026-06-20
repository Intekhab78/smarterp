const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config(); // Make sure this is at the top

// Generate signature for Hotelbeds API
function generateSignature() {
  const timestamp = Math.floor(Date.now() / 1000);
  const raw = apiKey + secret + timestamp;
  const signature = crypto.createHash("sha256").update(raw).digest("hex");
  return { signature, timestamp };
}

// ----------------- Hotelbeds APIs --------------------

async function getHotelbedsStatus() {
  const { signature } = generateSignature();

  const response = await axios.get(
    "https://api.test.hotelbeds.com/hotel-api/1.0/status",
    {
      headers: {
        Accept: "application/json",
        "Api-key": apiKey,
        "X-Signature": signature,
      },
    }
  );

  return response.data;
}

async function getHotelList() {
  const { signature } = generateSignature();

  const response = await axios.get(
    "https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels",
    {
      headers: {
        Accept: "application/json",
        "Api-key": apiKey,
        "X-Signature": signature,
      },
      params: {
        fields: "all",
        from: 1,
        to: 10,
        useSecondaryLanguage: false,
      },
    }
  );

  return response.data;
}

// ----------------- Booking.com via RapidAPI --------------------

async function getBookingHotels(query = "man") {
  const response = await axios.get(
    `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination`,
    {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY_BOOKING,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST_BOOKING,
      },
      params: {
        query: query,
      },
    }
  );

  return response.data;
}

const fetchHotelByDestination = async (req, res) => {
  const {
    dest_id = "-2092174",
    search_type = "CITY",
    adults = 1,
    children_age = "0%2C17",
    room_qty = 1,
    page_number = 1,
    units = "metric",
    temperature_unit = "c",
    languagecode = "en-us",
    currency_code = "AED",
    location = "US",
    arrival_date = "2025-08-20", // ✅ Added
    departure_date = "2025-08-25", // ✅ Added
  } = req.query;

  try {
    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY_BOOKING,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST_BOOKING,
        },
        params: {
          dest_id,
          search_type,
          adults,
          children_age,
          room_qty,
          page_number,
          units,
          temperature_unit,
          languagecode,
          currency_code,
          location,
          arrival_date, // ✅ Make sure these two are sent
          departure_date,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Hotel Search API Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const fetchHotelDetails = async (req, res) => {
  const {
    hotel_id,
    adults = 1,
    children_age = "1,17",
    room_qty = 1,
    units = "metric",
    temperature_unit = "c",
    languagecode = "en-us",
    currency_code = "EUR",
    arrival_date = "2025-08-20",
    departure_date = "2025-08-25",
  } = req.query;

  if (!hotel_id) {
    return res.status(400).json({ error: "hotel_id is required" });
  }

  try {
    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails",
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY_BOOKING,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST_BOOKING,
        },
        params: {
          hotel_id,
          adults,
          children_age,
          room_qty,
          units,
          temperature_unit,
          languagecode,
          currency_code,
          arrival_date,
          departure_date,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Hotel Details API Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// ----------------- Express Controller Functions --------------------

const fetchStatus = async (req, res) => {
  try {
    const result = await getHotelbedsStatus();
    res.json(result);
  } catch (error) {
    console.error("Status Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const fetchHotelList = async (req, res) => {
  try {
    const result = await getHotelList();
    res.json(result);
  } catch (error) {
    console.error("Hotel List Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const fetchBookingHotels = async (req, res) => {
  const query = req.query.q || "man";
  try {
    const result = await getBookingHotels(query);
    res.json(result);
  } catch (error) {
    console.error("Booking API Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// ----------------- Exporting All --------------------

module.exports = {
  fetchStatus,
  fetchHotelList,
  fetchBookingHotels,
  fetchHotelByDestination,
  fetchHotelDetails,
};
