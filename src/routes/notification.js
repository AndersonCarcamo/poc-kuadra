const express = require('express')
const router = express.Router();
const notificationController = require('../controllers/notification');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestión de notificaciones del sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la notificación
 *         user_id:
 *           type: integer
 *           description: ID del usuario destinatario
 *         reservation_id:
 *           type: integer
 *           nullable: true
 *           description: ID de la reserva relacionada (opcional)
 *         message:
 *           type: string
 *           description: Contenido del mensaje
 *         sent_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de envío
 *         is_read:
 *           type: boolean
 *           description: Indica si la notificación ha sido leída
 */

/**
 * @swagger
 * /api/notifications/admin/all:
 *   get:
 *     summary: Obtener todas las notificaciones (solo admin)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 */
router.get('/admin/all', notificationController.getAllNotifications);

/**
 * @swagger
 * /api/notifications/user/{userId}:
 *   get:
 *     summary: Obtener notificaciones de un usuario específico
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/user/:userId', notificationController.getUserNotifications);

/**
 * @swagger
 * /api/notifications/reservation/{reservationId}:
 *   get:
 *     summary: Obtener notificaciones de una reserva específica
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones de la reserva
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/reservation/:reservationId', notificationController.getReservationNotifications);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   get:
 *     summary: Obtener una notificación por su ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles de la notificación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Notificación no encontrada
 */
router.get('/:notificationId', notificationController.getNotificationById);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Crear una nueva notificación
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - message
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID del usuario destinatario
 *               reservation_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID de la reserva relacionada (opcional)
 *               message:
 *                 type: string
 *                 description: Contenido del mensaje
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', notificationController.createNotification);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   put:
 *     summary: Actualizar una notificación existente
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Nuevo mensaje para la notificación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Notificación no encontrada
 */
router.put('/:notificationId', notificationController.updateNotification);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   delete:
 *     summary: Eliminar una notificación
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación a eliminar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Notificación eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Notificación no encontrada
 */
router.delete('/:notificationId', notificationController.deleteNotification);

/**
 * @swagger
 * /api/notifications/user/{userId}/all:
 *   delete:
 *     summary: Eliminar todas las notificaciones de un usuario
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Todas las notificaciones del usuario eliminadas exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/user/:userId/all', notificationController.deleteUserNotifications);

module.exports = router;