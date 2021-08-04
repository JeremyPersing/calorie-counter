const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const url = "https://pixabay.com/api/";
  const apiKey = process.env.pixabayApiKey;

  const options = {
    params: {
      key: apiKey,
      q: req.body.query,
      lang: "en",
      image_type: "photo",
      orientation: "horizontal",
      category: "food",
      safesearch: "true",
    },
  };

  try {
    const response = await axios.get(url, options);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
