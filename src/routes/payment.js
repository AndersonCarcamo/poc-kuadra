const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Operaciones relacionadas con pagos
 */

/**
 * @swagger
 * /payments/process:
 *   post:
 *     summary: Procesa un nuevo pago
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - tenantId
 *               - reservationId
 *               - amount
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario que realiza el pago
 *               tenantId:
 *                 type: integer
 *                 description: ID del propietario (tenant) que recibe el pago
 *               reservationId:
 *                 type: integer
 *                 description: ID de la reserva asociada al pago
 *               amount:
 *                 type: number
 *                 description: Monto del pago
 *               method:
 *                 type: string
 *                 description: Método de pago (tarjeta, efectivo, etc.)
 *                 example: "credit_card"
 *     responses:
 *       200:
 *         description: Pago procesado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *                 distribution:
 *                   type: object
 *                   description: Información sobre la distribución del pago
 *                 message:
 *                   type: string
 *                   example: "Pago procesado exitosamente"
 *       400:
 *         description: Datos incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Datos incompletos"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/process', paymentController.processPayment);

module.exports = router;