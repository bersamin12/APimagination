const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim().length < 2) {
    return res.json([]);
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEOAPIFY_API_KEY in .env" });
  }

  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/autocomplete",
      {
        params: {
          text: query,
          limit: 15,
          apiKey: apiKey,
        },
      }
    );

    const features = response.data.features || [];

    const results = features
      .map((feature) => {
        const props = feature.properties;

        const isCity =
          props.result_type === "city" ||
          props.result_type === "postcode" ||
          !!props.city;

        if (!isCity) return null;

        const cityName = props.city || props.name || props.formatted;
        const stateName = props.state || props.county || "";
        const countryName = props.country || "";

        return {
          name: stateName ? `${cityName}, ${stateName}` : cityName,
          type: "city",
          countryName,
          latitude: props.lat,
          longitude: props.lon,
          externalId: props.place_id,
        };
      })
      .filter(Boolean);

    const uniqueResults = results.filter(
      (place, index, self) =>
        index ===
        self.findIndex(
          (p) =>
            p.name === place.name &&
            p.type === place.type &&
            p.countryName === place.countryName
        )
    );

    res.json(uniqueResults);
  } catch (error) {
    console.error(
      "Geoapify search error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch search results.",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;