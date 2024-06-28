const express = require('express');
const router = express.Router();
const inspectionDepReport = require('../controllers/inspectionDepReport.controller');
const { upload } = require('../middlewares/multer');
// Create a new inspection
router.post('/create',upload.single('pv_file'), inspectionDepReport.createInspectionDepReport);

// Get all inspections
router.get('/:id', inspectionDepReport.getInspectionDepReport);
router.get('/download/:id', inspectionDepReport.downloadFiles);

// Other routes for updating, deleting, etc. can be added similarly

module.exports = router;
