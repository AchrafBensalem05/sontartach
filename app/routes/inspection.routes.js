const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspection.controller');

// Create a new inspection
router.post('/create', inspectionController.createInspection);


router.get('/getAll', inspectionController.getAllInspections);


router.get('/stats', inspectionController.getStats);

module.exports = router;
