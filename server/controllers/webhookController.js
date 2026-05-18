import crypto from "crypto";
import Payment from "../models/Payment.js";
import RepairJob from "../models/RepairJob.js";
import TransactionLog from "../models/TransactionLog.js";

/**
 * @desc    Handle Razorpay Webhooks
 * @route   POST /api/payments/webhook
 * @access  Public (Verified by Signature)
 */
export const handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "dummy_webhook_secret";
  
  // 1. Verify Webhook Signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    console.error("❌ Invalid Webhook Signature");
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`🔔 Webhook Received: ${event}`);

  try {
    // 2. Handle Specific Events
    if (event === "payment.captured" || event === "order.paid") {
      const orderId = payload.payment?.entity?.order_id || payload.order?.entity?.id;
      
      const payment = await Payment.findOne({ orderId });
      if (payment && payment.paymentStatus !== "completed") {
        // Recovery Logic: Update records if frontend missed it
        payment.paymentStatus = "completed";
        payment.paidAt = new Date();
        await payment.save();

        await RepairJob.findByIdAndUpdate(payment.jobId, { 
          jobStatus: "paid",
          paymentStatus: "paid"
        });

        await TransactionLog.create({
          paymentId: payment._id,
          event: "webhook_received",
          status: "success",
          message: `Payment recovered via webhook: ${event}`
        });
      }
    }

    if (event === "payment.failed") {
      const orderId = payload.payment?.entity?.order_id;
      const payment = await Payment.findOne({ orderId });
      if (payment) {
        payment.paymentStatus = "failed";
        payment.failureReason = payload.payment?.entity?.error_description;
        await payment.save();

        await TransactionLog.create({
          paymentId: payment._id,
          event: "webhook_received",
          status: "failure",
          message: `Payment failed event: ${payment.failureReason}`
        });
      }
    }

    // Always return 200 to Razorpay
    res.status(200).json({ status: "ok" });

  } catch (error) {
    console.error("Webhook Processing Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
