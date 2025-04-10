const pool = require('../config/db');

exports.verifyTicket = async (req, res) => {
  const ticketId = parseInt(req.query.ticketId);

  if (!ticketId) {
    return res.status(400).json({ message: 'Falta ticketId' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM digital_tickets WHERE id = $1',
      [ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket inválido' });
    }

    return res.json({ message: 'Ticket válido', ticket: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};