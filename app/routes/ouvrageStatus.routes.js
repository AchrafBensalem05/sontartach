const express = require('express');
const router = express.Router();
const ouvrageStatusController = require('../controllers/ouvrageStatus.controller');

// Create a new inspection
router.post('/create', ouvrageStatusController.createResult);


router.get('/:id', ouvrageStatusController.getResult);


module.exports = router;
