const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

// POST /payments/process
router.post('/process', paymentController.processPayment);

module.exports = router;