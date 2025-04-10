const pool = require('../config/db');

exports.getParkings = async (req, res) => {
  const result = await pool.query('SELECT * FROM parkings');
  res.json(result.rows);
};

exports.getParkingById = async (req, res) => {
  const { parkingId } = req.params;
  const result = await pool.query('SELECT * FROM parkings WHERE id = $1', [parkingId]);
  res.json(result.rows[0]);
};

exports.createParking = async (req, res) => {
  const { owner_id, name, address, latitude, longitude } = req.body;
  const result = await pool.query(
    'INSERT INTO parkings (owner_id, name, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [owner_id, name, address, latitude, longitude]
  );
  res.status(201).json(result.rows[0]);
};

exports.updateParking = async (req, res) => {
  const { parkingId } = req.params;
  const { name, address, latitude, longitude } = req.body;
  const result = await pool.query(
    'UPDATE parkings SET name = $1, address = $2, latitude = $3, longitude = $4 WHERE id = $5 RETURNING *',
    [name, address, latitude, longitude, parkingId]
  );
  res.json(result.rows[0]);
};

exports.deleteParking = async (req, res) => {
  const { parkingId } = req.params;
  await pool.query('DELETE FROM parkings WHERE id = $1', [parkingId]);
  res.status(204).send();
};
