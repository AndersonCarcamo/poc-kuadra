const pool = require('../config/db');

exports.getVehicles = async (req, res) => {
  const result = await pool.query('SELECT * FROM vehicles');
  res.json(result.rows);
};

exports.getVehicleById = async (req, res) => {
  const { vehicleId } = req.params;
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
  res.json(result.rows[0]);
};

exports.createVehicle = async (req, res) => {
  const { user_id, plate_number, model, color } = req.body;
  const result = await pool.query(
    'INSERT INTO vehicles (user_id, plate_number, model, color) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, plate_number, model, color]
  );
  res.status(201).json(result.rows[0]);
};

exports.deleteVehicle = async (req, res) => {
  const { vehicleId } = req.params;
  await pool.query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);
  res.status(204).send();
};


exports.getVehiclesByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vehículos por usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};