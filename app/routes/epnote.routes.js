const express = require('express');
const router = express.Router();
const EpNoteController = require('../controllers/epnote.controller');
const { upload } = require('../middlewares/multer');
// Create a new inspection
router.post('/create',upload.single('pv_file'), EpNoteController.createEpNote);

// Get all inspections
router.get('/:id', EpNoteController.getEpNote);
router.get('/download/:id', EpNoteController.downloadFiles);

// Other routes for updating, deleting, etc. can be added similarly

module.exports = router;
