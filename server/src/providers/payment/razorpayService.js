import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

export const createRazorpayInstance = () => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay instance created");
    return instance;
  } catch (error) {
    console.error("❌ Failed to create Razorpay instance:", error);
    return null;
  }
};
