const express = require('express');
const router = express.Router();
const evaluation = require('../controllers/evaluation.controller');
const { upload } = require('../middlewares/multer');
// Create a new inspection
router.post('/create',upload.single('pv_evaluation'),evaluation.createEvaluation);

// Get all inspections
router.get('/:id', evaluation.getEvaluation);
router.get('/download/:id', evaluation.downloadFiles);
// Other routes for updating, deleting, etc. can be added similarly

module.exports = router;
