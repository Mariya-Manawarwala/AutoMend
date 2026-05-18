import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const notifyAdmins = async (message, type, data = {}) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id");
    
    const notifications = admins.map(admin => ({
      userId: admin._id,
      message,
      type,
      data
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error("Admin Notification Error:", error);
  }
};
