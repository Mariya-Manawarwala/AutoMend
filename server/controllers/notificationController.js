import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (
    !notification ||
    notification.userId.toString() !== req.user._id.toString()
  ) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notification.isRead = true;
  await notification.save();
  res.json(notification);
};
