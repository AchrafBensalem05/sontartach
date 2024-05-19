const express = require('express');
const pipeController = require('../controllers/pipe.controller');

const router = express.Router();

// Route to create a new Well
router.post('/create-pipe', pipeController.createPipe);

// get all pipes
router.get('/', pipeController.getAllPipes);

router.get('/:id/segments',pipeController.getSegmentsByPipeId);

// Route to get a specific Pipe by ID
router.get('/:id', pipeController.getPipeById);

// Route to update a Pipe by ID
router.patch('/:id', pipeController.updatePipe);

// Route to delete a Pipe by ID
router.delete('/:id', pipeController.deletePipeById);

module.exports = router;
