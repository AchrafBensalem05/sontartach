const express = require('express');
const pipeController = require('../controllers/pipe.controller');

const router = express.Router();

// Route to create a new Well
router.post('/create-pipe', pipeController.createPipe);

module.exports = router;
