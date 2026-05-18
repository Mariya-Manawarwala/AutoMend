import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairJob",
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairRequest",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, default: "Online" },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "created", "authorized", "completed", "failed", "refunded", "suspicious"],
      default: "pending" 
    },
    orderId: { type: String, unique: true, sparse: true },
    razorpay_payment_id: String,
    razorpay_signature: String,
    paidAt: Date,
    failureReason: String,
    note: String,
    metadata: {
      browser: String,
      ip: String,
    }
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
