const express = require('express');
const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');

const router = express.Router();

router.post('/email', (req, res) => {
  const { to, subject, text } = req.body;
  sendEmail(to, subject, text);
  res.status(201).json({ message: 'Email sent' });
});

router.post('/sms', (req, res) => {
  const { to, message } = req.body;
  sendSMS(to, message);
  res.status(201).json({ message: 'SMS sent' });
});


const { sendNotification, getNotifications } = require('../controllers/notification.controller');



router.post('/notifications', sendNotification);
router.get('/', getNotifications);

module.exports = router;

