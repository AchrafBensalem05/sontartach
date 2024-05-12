const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetry.controller');

// Route to handle incoming telemetry data
router.post('/create', telemetryController.receiveTelemetryData);

module.exports = router;
