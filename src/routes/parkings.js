const express = require('express');
const router = express.Router();
const parkingsController = require('../controllers/parkings');

/**
 * @swagger
 * tags:
 *   name: Parkings
 *   description: Gestión de estacionamientos
 */

/**
 * @swagger
 * /parkings:
 *   get:
 *     summary: Obtener todos los estacionamientos
 *     tags: [Parkings]
 *     responses:
 *       200:
 *         description: Lista de estacionamientos
 */
router.get('/', parkingsController.getParkings);

/**
 * @swagger
 * /parkings:
 *   post:
 *     summary: Crear un nuevo estacionamiento
 *     tags: [Parkings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parking'
 *     responses:
 *       201:
 *         description: Estacionamiento creado
 */
router.post('/', parkingsController.createParking);

/**
 * @swagger
 * /parkings/{parkingId}:
 *   get:
 *     summary: Obtener un estacionamiento por ID
 *     tags: [Parkings]
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del estacionamiento
 */
router.get('/:parkingId', parkingsController.getParkingById);

/**
 * @swagger
 * /parkings/{parkingId}:
 *   put:
 *     summary: Actualizar un estacionamiento
 *     tags: [Parkings]
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parking'
 *     responses:
 *       200:
 *         description: Estacionamiento actualizado
 */
router.put('/:parkingId', parkingsController.updateParking);

/**
 * @swagger
 * /parkings/{parkingId}:
 *   delete:
 *     summary: Eliminar un estacionamiento
 *     tags: [Parkings]
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Estacionamiento eliminado
 */
router.delete('/:parkingId', parkingsController.deleteParking);

module.exports = router;
