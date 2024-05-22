const express = require('express');

const wellController = require('../controllers/well.controller');
const upload = require('../middlewares/upload');
const authenticateToken =require('../middlewares/auth')
const router = express.Router();

// Route to create a new Well
router.post('/create-well', authenticateToken.authenticateToken, wellController.createWell);
////////

router.post('/upload', upload.single('file'), wellController.addWellsFromCSV);

// Route to get all Wells
router.get('/', authenticateToken.authenticateToken, authenticateToken.isPipeAdmin, wellController.getAllWells);

// Route to get a specific Well by ID
router.get('/:id', authenticateToken.authenticateToken, wellController.getWellById);

// Route to update a Well by ID
router.patch('/:id',authenticateToken.authenticateToken, wellController.updateWellById);

// Route to delete a Well by ID

module.exports = router;
