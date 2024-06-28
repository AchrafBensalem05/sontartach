const express = require("express");
const router = express.Router();
const constructionStatus = require("../controllers/constructionStatus.controller");
const { upload } = require("../middlewares/multer");
// Create a new inspection
router.post("/create", constructionStatus.createContructionStatus);

// Get all inspections
router.get("/:id", constructionStatus.getConstructionStatus);

// Other routes for updating, deleting, etc. can be added similarly

module.exports = router;
