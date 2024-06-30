const Notification = require('../models/notification');
const { getIo } = require('../socket');

const sendNotification = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const notification = new Notification({ message, userId });
    await notification.save();

    const io = getIo();
    console.log(`Sending notification to user ${userId}: ${message}`);
    io.to(userId.toString()).emit('notification', message);

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching notifications for user ${userId}`);
    const notifications = await Notification.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
const getNotification = async (req,res) =>{
  const notifications= await Notification.find();
  res.status(200).json(notifications)
}





module.exports = { sendNotification, getNotification, getUserNotifications };
