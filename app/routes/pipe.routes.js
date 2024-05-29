const express = require('express');
const pipeController = require('../controllers/pipe.controller');
const authenticateToken = require('../middlewares/auth'); // Import the middleware for authentication

const router = express.Router();

// Route to create a new Pipe
router.post('/create-pipe', authenticateToken.authenticateToken, authenticateToken.isPipeAdmin, pipeController.createPipe);

// Route to get all Pipes
router.get('/', authenticateToken.authenticateToken , pipeController.getAllPipes);

// Route to get all segments by Pipe ID
router.get('/:id/segments', authenticateToken.authenticateToken, pipeController.getSegmentsByPipeId);

// Route to get a specific Pipe by ID
router.get('/:id', authenticateToken.authenticateToken, pipeController.getPipeById);

// Route to update a Pipe by ID
router.patch('/:id', authenticateToken.authenticateToken, authenticateToken.isPipeAdmin, pipeController.updatePipe);

// Route to delete a Pipe by ID
router.delete('/:id', authenticateToken.authenticateToken, pipeController.deletePipeById);


module.exports = router;
