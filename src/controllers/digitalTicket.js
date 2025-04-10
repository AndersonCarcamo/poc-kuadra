const pool = require('../config/db');

exports.verifyTicket = async (req, res) => {
  const { access_code } = req.query;
  const result = await pool.query('SELECT * FROM digital_tickets WHERE access_code = $1', [access_code]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Ticket inválido' });
  }
  res.json(result.rows[0]);
};
