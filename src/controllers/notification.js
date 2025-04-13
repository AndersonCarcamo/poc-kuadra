
const pool = require('../config/db')

/**
 * Obtiene todas las notificaciones
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getAllNotifications = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM notifications ORDER BY sent_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
  };
  
  /**
   * Obtiene todas las notificaciones de un usuario específico
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  exports.getUserNotifications = async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await pool.query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY sent_at DESC',
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener notificaciones del usuario:', error);
      res.status(500).json({ error: 'Error al obtener notificaciones del usuario' });
    }
  };
  
  /**
   * Obtiene una notificación por su ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  exports.getNotificationById = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const result = await pool.query('SELECT * FROM notifications WHERE id = $1', [notificationId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener la notificación:', error);
      res.status(500).json({ error: 'Error al obtener la notificación' });
    }
  };
  
  /**
   * Crea una nueva notificación
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  exports.createNotification = async (req, res) => {
    try {
      const { user_id, reservation_id, message } = req.body;
      
      if (!user_id || !message) {
        return res.status(400).json({ error: 'Usuario y mensaje son campos obligatorios' });
      }
      
      const result = await pool.query(
        'INSERT INTO notifications (user_id, reservation_id, message) VALUES ($1, $2, $3) RETURNING *',
        [user_id, reservation_id, message]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear la notificación:', error);
      res.status(500).json({ error: 'Error al crear la notificación' });
    }
  };
  
  /**
   * Actualiza una notificación existente
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  exports.updateNotification = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'El mensaje es un campo obligatorio' });
      }
      
      const result = await pool.query(
        'UPDATE notifications SET message = $1 WHERE id = $2 RETURNING *',
        [message, notificationId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar la notificación:', error);
      res.status(500).json({ error: 'Error al actualizar la notificación' });
    }
  };
  
  /**
   * Elimina una notificación
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  exports.deleteNotification = async (req, res) => {
    try {
      const { notificationId } = req.params;
      
      const result = await pool.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [notificationId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
      res.status(500).json({ error: 'Error al eliminar la notificación' });
    }
  };
  
  /**
   * Elimina todas las notificaciones de un usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  exports.deleteUserNotifications = async (req, res) => {
    try {
      const { userId } = req.params;
      
      await pool.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar las notificaciones del usuario:', error);
      res.status(500).json({ error: 'Error al eliminar las notificaciones del usuario' });
    }
  };
  
  /**
   * Obtiene todas las notificaciones relacionadas con una reserva específica
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  exports.getReservationNotifications = async (req, res) => {
    try {
      const { reservationId } = req.params;
      const result = await pool.query(
        'SELECT * FROM notifications WHERE reservation_id = $1 ORDER BY sent_at DESC',
        [reservationId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener notificaciones de la reserva:', error);
      res.status(500).json({ error: 'Error al obtener notificaciones de la reserva' });
    }
  };