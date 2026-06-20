const axios = require("axios");

const getFlightSuggestions = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query parameter `q` is required" });
  }

  const options = {
    method: "GET",
    url: "https://agoda-travel.p.rapidapi.com/agoda-app/flight/autocomplete",
    params: { query },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY_FLIGHT,
      "x-rapidapi-host": process.env.RAPIDAPI_HOST_FLIGHT,
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching flight suggestions:", error.message);
    res.status(500).json({ error: "Failed to fetch flight suggestions" });
  }
};

const searchOneWayFlight = async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "origin and destination are required" });
  }

  try {
    const response = await axios.get(
      `https://${process.env.RAPIDAPI_HOST}/agoda-app/flight/search-one-way`,
      {
        params: { origin, destination },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY_FLIGHT,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST_FLIGHT,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Flight search error:", error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
};

module.exports = { getFlightSuggestions, searchOneWayFlight };
