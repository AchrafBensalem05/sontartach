const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Use the current timestamp to avoid naming conflicts
  }
});

// File filter for CSV files
const fileFilter = (req, file, cb) => {
    console.log('aaaaaaaaa')
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf') {
    return cb(new Error('Only pdf files are allowed'), false);
  }
  cb(null, true);

};

// Set up multer with storage and file filter
const upload = multer({ storage, fileFilter });
const upload2 = multer({ storage, fileFilter });

module.exports = {upload,upload2};
