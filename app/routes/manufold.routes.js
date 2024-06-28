const express = require('express');

const manufoldController = require('../controllers/manufold.controller');
const { upload2, upload } = require('../middlewares/multer');

const router = express.Router();

// Route to create a new manufold
router.post('/create-manifold',upload.fields([{name: 'file', maxCount: 2},{name: 'planFile', maxCount: 2}]),manufoldController.createManufold);


// Route to get all manufolds
router.get('/getAll', manufoldController.getAllManufolds);

// Route to get a specific manufold by ID

router.get('/download/:id', manufoldController.downloadFiles);

router.get('/:id', manufoldController.getManufoldById);

// Route to update a manufold by ID
router.patch('/:id', manufoldController.updateManufoldById);

// Route to delete a manufold by ID

module.exports = router;
