const express = require('express');

const junctionController = require('../controllers/junction.controller');

const router = express.Router();

// Route to create a new junction
router.post('/create-junction', junctionController.createJunction);


// Route to get all junctions
router.get('/getAll', junctionController.getAllJunctions);

// Route to get a specific junction by ID
router.get('/:id', junctionController.getJunctionById);

// Route to update a junction by ID
router.patch('/:id', junctionController.updateJunctionById);

// Route to delete a junction by ID

module.exports = router;
