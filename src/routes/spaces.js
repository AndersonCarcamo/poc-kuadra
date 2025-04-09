const express = require('express');
const router = express.Router();
const { getNearbyParkings } = require('../models/queries');

// GET /spaces/nearby
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    const parkings = await getNearbyParkings(lat, lon, radius);
    res.json(parkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;