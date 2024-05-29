const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Log incoming requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post('/users/signup', (req, res, next) => {
  console.log('Signup route hit');
  console.log(req.body)
  authController.signup(req, res, next);

});

router.post('/users/signin', (req, res, next) => {
  console.log('Signup route hit');
  console.log(req.body)
  authController.signin(req, res, next);

});

module.exports = router;