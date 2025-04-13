const express = require('express');
const router = express.Router();
const {   getNearbyParkings } = require('../models/queries');

/**
 * @swagger
 * tags:
 *   name: Spaces
 *   description: Operaciones relacionadas con espacios de estacionamiento
 */

/**
 * @swagger
 * /spaces/nearby:
 *   get:
 *     summary: Obtiene espacios de estacionamiento cercanos a una ubicación
 *     tags: [Spaces]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitud de la ubicación actual
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitud de la ubicación actual
 *       - in: query
 *         name: radius
 *         required: true
 *         schema:
 *           type: number
 *         description: Radio de búsqueda en kilómetros
 *     responses:
 *       200:
 *         description: Lista de espacios de estacionamiento cercanos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Spaces'
 *       400:
 *         description: Parámetros faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan parámetros requeridos"
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
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    const parkings = await getNearbyParkings(lat, lon, radius);
    res.json(parkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;