import Razorpay from "razorpay";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

// Safety check for keys
const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  console.warn("⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payments will run in SAFE TEST MOCK MODE.");
}

export const razorpay = new Razorpay({
  key_id: KEY_ID || "rzp_test_dummy_key",
  key_secret: KEY_SECRET || "dummy_secret",
});

export const getRazorpayConfig = () => ({
  isTestMode: !KEY_ID || KEY_ID.startsWith("rzp_test"),
  key: KEY_ID || "rzp_test_dummy_key",
  isProduction
});
