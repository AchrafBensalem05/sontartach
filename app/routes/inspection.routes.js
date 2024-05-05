const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspection.controller');

// Create a new inspection
router.post('/create', inspectionController.createInspection);

// Get all inspections
router.get('/', inspectionController.getAllInspections);

// Other routes for updating, deleting, etc. can be added similarly

module.exports = router;
