const express = require('express');
const wellController = require('../controllers/well.controller');

const router = express.Router();

// Route to create a new Well
router.post('/create-well', wellController.createWell);

module.exports = router;
