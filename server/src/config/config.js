import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  server: {
    port: process.env.PORT || 5000,
  },
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    adminEmail: process.env.ADMIN_EMAIL || "admin@myshop.com",
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  sms: {
    apiKey: process.env.SMSALERT_APIKEY,
    senderId: process.env.SMSALERT_SENDERID,
    apiUrl: process.env.SMS_API_URL,
  },
  payment: {
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  xpressbees: {
    baseUrl: process.env.XPRESSBEES_API_BASE_URL,
    email: process.env.XPRESSBEES_EMAIL,
    password: process.env.XPRESSBEES_PASSWORD
  },
  shiprocket: {
    baseUrl: process.env.SHIPROCKET_BASE_URL,
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
    webhookSecret: process.env.SHIPROCKET_WEBHOOK_SECRET
  },
};

export default config;