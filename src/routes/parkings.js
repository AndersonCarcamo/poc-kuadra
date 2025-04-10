const express = require('express');
const router = express.Router();
const parkingsController = require('../controllers/parkings');

// /parkings
router.get('/', parkingsController.getParkings);
router.post('/', parkingsController.createParking);

// /parkings/:parkingId
router.get('/:parkingId', parkingsController.getParkingById);
router.put('/:parkingId', parkingsController.updateParking);
router.delete('/:parkingId', parkingsController.deleteParking);

module.exports = router;
