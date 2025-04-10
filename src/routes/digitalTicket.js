const express = require('express');
const router = express.Router();
const digitalTicketController = require('../controllers/digitalTicket');

/**
 * @swagger
 * tags:
 *   name: DigitalTicket
 *   description: Verificación de tickets digitales
 */

/**
 * @swagger
 * /digitalTicket/verify:
 *   get:
 *     summary: Verificar un ticket digital por ID
 *     tags: [DigitalTicket]
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ticket digital
 *     responses:
 *       200:
 *         description: Ticket verificado correctamente
 */
router.get('/verify', digitalTicketController.verifyTicket);

module.exports = router;
