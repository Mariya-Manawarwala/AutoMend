import mongoose from "mongoose";

const transactionLogSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairJob",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: { 
      type: String, 
      required: true,
      enum: ["order_created", "verification_started", "payment_verified", "verification_failed", "webhook_received", "webhook_failed", "fraud_detected"]
    },
    status: { type: String, enum: ["success", "failure", "pending"], default: "pending" },
    message: String,
    rawResponse: Object, // Store Razorpay raw data for debugging
    ipAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model("TransactionLog", transactionLogSchema);
