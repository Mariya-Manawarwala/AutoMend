import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    garageName: { type: String, default: "AutoMend Premium Auto Care" },
    email: { type: String, default: "admin@automend.com" },
    phone: { type: String, default: "+1 800-123-4567" },
    address: { type: String, default: "123 Luxury Drive, Automotive District, Metro City" },
    operatingHours: { type: String, default: "08:00 AM - 08:00 PM" },
    taxRate: { type: String, default: "18" },
    currency: { type: String, default: "INR (₹)" },
  },
  { timestamps: true }
);

export default mongoose.model("SystemSettings", systemSettingsSchema);
