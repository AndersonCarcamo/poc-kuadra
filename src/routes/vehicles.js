const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehicles');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Gestión de vehículos
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: Lista de vehículos
 */
router.get('/', vehiclesController.getVehicles);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Registrar un nuevo vehículo
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Vehículo registrado
 */
router.post('/', vehiclesController.createVehicle);

/**
 * @swagger
 * /vehicles/{vehicleId}:
 *   get:
 *     summary: Obtener un vehículo por ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del vehículo
 */
router.get('/:vehicleId', vehiclesController.getVehicleById);

/**
 * @swagger
 * /vehicles/{userId}:
 *   get:
 *     summary: Obtener vehicules de usario por ID del usuario
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del vehículo
 */

router.get('/user/:userId', vehiclesController.getVehiclesByUserId);


/**
 * @swagger
 * /vehicles/{vehicleId}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Vehículo eliminado
 */
router.delete('/:vehicleId', vehiclesController.deleteVehicle);

module.exports = router;
