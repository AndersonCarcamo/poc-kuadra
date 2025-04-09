const { getParkingsInRadius } = require('../models/queries');

const getNearbyParkings = async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;

    if (!lat || !lon || !radius) {
      return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const parkings = await getParkingsInRadius(lat, lon, radius);
    res.json(parkings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNearbyParkings };