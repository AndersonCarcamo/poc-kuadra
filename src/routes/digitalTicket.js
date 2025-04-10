const express = require('express');
const router = express.Router();
const digitalTicketController = require('../controllers/digitalTicket');

// /digitalTicket/verify
router.get('/verify', digitalTicketController.verifyTicket);

module.exports = router;
