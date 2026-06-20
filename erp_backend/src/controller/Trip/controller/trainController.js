const axios = require("axios");

const fetchTrainDetails = async (req, res) => {
  const trainNumber = req.params.trainNumber;

  const options = {
    method: "GET",
    url: `https://${process.env.RAPIDAPI_HOST}/api/trains-search/v1/train/${trainNumber}`,
    params: { isH5: "true", client: "web" },
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Train API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch train details" });
  }
};

module.exports = {
  fetchTrainDetails,
};
