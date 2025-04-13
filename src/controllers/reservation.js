const pool = require('../config/db');

// Obtener todas las reservas
exports.getAllReservations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Obtener una reserva por ID
exports.getReservationById = async (req, res) => {
  try {
    const { reservationId } = req.params;
    
    const result = await pool.query('SELECT * FROM reservations WHERE id = $1', [reservationId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener la reserva:', error);
    res.status(500).json({ error: 'Error al obtener la reserva' });
  }
};

// Crear una nueva reserva
exports.createReservation = async (req, res) => {
  try {
    const { space_id, user_id, vehicle_id, start_time, end_time } = req.body;
    
    // Validar datos requeridos
    if (!space_id || !user_id || !vehicle_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const result = await pool.query(
      `INSERT INTO reservations 
      (space_id, user_id, vehicle_id, status, start_time, end_time) 
      VALUES ($1, $2, $3, 'pending_payment', $4, $5) 
      RETURNING *`,
      [space_id, user_id, vehicle_id, start_time, end_time]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

// Actualizar una reserva
exports.updateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status, start_time, end_time } = req.body;
    
    // Verificar que el estado sea válido si se proporciona
    if (status) {
      const validStatuses = ['pending_payment', 'to_be_collected', 'confirmed', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Estado no válido', 
          validStatuses 
        });
      }
    }
    
    // Construir la consulta de actualización dinámicamente
    let updateFields = [];
    let queryParams = [];
    let paramCounter = 1;
    
    if (status) {
      updateFields.push(`status = $${paramCounter}`);
      queryParams.push(status);
      paramCounter++;
    }
    
    if (start_time) {
      updateFields.push(`start_time = $${paramCounter}`);
      queryParams.push(start_time);
      paramCounter++;
    }
    
    if (end_time) {
      updateFields.push(`end_time = $${paramCounter}`);
      queryParams.push(end_time);
      paramCounter++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }
    
    // Agregar el ID de reserva al final de los parámetros
    queryParams.push(reservationId);
    
    const query = `
      UPDATE reservations 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;
    
    const result = await pool.query(query, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    res.status(500).json({ error: 'Error al actualizar la reserva' });
  }
};

// Eliminar una reserva
exports.deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    
    // Verificar que la reserva exista
    const checkResult = await pool.query('SELECT * FROM reservations WHERE id = $1', [reservationId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    // Eliminar la reserva
    await pool.query('DELETE FROM reservations WHERE id = $1', [reservationId]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
};