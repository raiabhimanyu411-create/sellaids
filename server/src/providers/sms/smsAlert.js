import axios from "axios";
import config from "../../config/config.js";

export const sendSMS = async (mobile, message, route = "transactional") => {
  try {
    const API_KEY = config.sms.apiKey;
    const SENDER_ID = config.sms.senderId;
    if (!mobile || !message) {
      throw new Error("Missing one or more required parameters (mobile, message)");
    }

    const encodedMessage = encodeURIComponent(message);

    const url = `https://www.smsalert.co.in/api/push.json?apikey=${API_KEY}&route=${route}&sender=${SENDER_ID}&mobileno=${mobile}&text=${encodedMessage}`;

    const { data } = await axios.get(url);

    if (data.status === "success") {
      console.log("✅ SMS sent successfully:", data.description.desc);
      return { success: true, data };
    } else {
      console.warn("SMS sending failed:", data);
      return { success: false, data };
    }
  } catch (error) {
    console.error("SMS sending error:", error.message);
    return { success: false, error: error.message };
  }
};