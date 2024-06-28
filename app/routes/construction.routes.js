const express = require('express');
const router = express.Router();
const construction = require('../controllers/construction.controller');
const { upload } = require('../middlewares/multer');
// Create a new inspection
router.post('/create',upload.single('report_file'),construction.createContruction);

// Get all inspections
router.get('/:id', construction.getConstruction);

// Other routes for updating, deleting, etc. can be added similarly

module.exports = router;
