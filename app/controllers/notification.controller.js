const Notification = require('../models/Notification');
const { getIo } = require('../socket');

const sendNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const notification = new Notification({ message });
    await notification.save();

    const io = getIo();
    io.emit('notification', message);

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

module.exports = { sendNotification, getNotifications };
