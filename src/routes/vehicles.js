const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehicles');

// /vehicles
router.get('/', vehiclesController.getVehicles);
router.post('/', vehiclesController.createVehicle);

// /vehicles/:vehicleId
router.get('/:vehicleId', vehiclesController.getVehicleById);
router.delete('/:vehicleId', vehiclesController.deleteVehicle);

module.exports = router;
