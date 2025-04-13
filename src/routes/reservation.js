const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Operaciones relacionadas con reservas de estacionamiento
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la reserva
 *         space_id:
 *           type: integer
 *           description: ID del espacio de estacionamiento
 *         user_id:
 *           type: integer
 *           description: ID del usuario que hizo la reserva
 *         vehicle_id:
 *           type: integer
 *           description: ID del vehículo asociado
 *         status:
 *           type: string
 *           enum: [pending_payment, to_be_collected, confirmed, in_progress, completed, cancelled]
 *           description: Estado actual de la reserva
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Hora de inicio de la reserva
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: Hora de finalización de la reserva
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Obtiene todas las reservas
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Error del servidor
 */
router.get('/', reservationController.getAllReservations);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   get:
 *     summary: Obtiene una reserva por su ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Detalles de la reserva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:reservationId', reservationController.getReservationById);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - space_id
 *               - user_id
 *               - vehicle_id
 *               - start_time
 *               - end_time
 *             properties:
 *               space_id:
 *                 type: integer
 *                 description: ID del espacio a reservar
 *               user_id:
 *                 type: integer
 *                 description: ID del usuario que realiza la reserva
 *               vehicle_id:
 *                 type: integer
 *                 description: ID del vehículo para el cual se reserva
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio de la reserva
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de finalización de la reserva
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error del servidor
 */
router.post('/', reservationController.createReservation);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   put:
 *     summary: Actualiza una reserva
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending_payment, to_be_collected, confirmed, in_progress, completed, cancelled]
 *                 description: Nuevo estado de la reserva
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha/hora de inicio
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha/hora de finalización
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Datos inválidos o estado no válido
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:reservationId', reservationController.updateReservation);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   delete:
 *     summary: Elimina una reserva
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       204:
 *         description: Reserva eliminada exitosamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:reservationId', reservationController.deleteReservation);

module.exports = router;