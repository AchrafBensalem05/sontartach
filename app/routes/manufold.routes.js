const express = require('express');

const manufoldController = require('../controllers/manufold.controller');

const router = express.Router();

// Route to create a new manufold
router.post('/create-manufold', manufoldController.createManufold);


// Route to get all manufolds
router.get('/', manufoldController.getAllManufolds);

// Route to get a specific manufold by ID
router.get('/:id', manufoldController.getManufoldById);

// Route to update a manufold by ID
router.patch('/:id', manufoldController.updateManufoldById);

// Route to delete a manufold by ID

module.exports = router;
