import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import sessionMiddleware from "./config/sessionConfig.js";
import userIndexRoutes from "./routes/user/userIndexRoutes.js";
import vendorIndexRoutes from "./routes/vendor/vendorIndexRoutes.js";
import adminIndexRoutes from "./routes/admin/adminIndexRoutes.js";
import productFormRoutes from "./routes/product/productFormRoutes.js";
import paymentRoutes from "./routes/payment/paymentRoutes.js";
import xpressbeesRoutes from "./routes/xpressbees/xpressbeesRoutes.js"
import contactRoutes from "./routes/contactForm/contactRoutes.js"
import { mapShiprocketStatusToOrderStatus } from "./providers/orderTracking/orderTracking.js";
import { Order } from "./models/orderModel.js";
import { sendSMS } from "./providers/sms/smsAlert.js";


const app = express();
app.disable("etag");
app.use(compression());

// 🛠️ Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.frontend.url,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(sessionMiddleware);

// 📂 Static File Serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, "public", "uploads");
// app.use("/uploads", express.static(imageDir));
app.use(
  "/uploads",
  express.static(imageDir, {
    maxAge: "365d",
    immutable: true,
    setHeaders: (res, filePath) => {
      res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
    },
  })
);

// const invoicesDir = path.join(__dirname, "public", "invoices");
// app.use("/invoices", express.static(invoicesDir));
const invoicesDir = path.join(__dirname, "public", "invoices");

app.use(
  "/invoices",
  express.static(invoicesDir, {
    setHeaders: (res) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
    },
  })
);


// webhook for order tracking updates

app.post("/webhook/order-tracking", async (req, res) => {
  try {
    const tokenFromShiprocket = req.headers["x-api-key"];

    if (tokenFromShiprocket !== config.shiprocket.webhookSecret) {
      return res.status(401).json({ message: "Invalid webhook token" });
    }

    console.log("Webhook verified");

    const payload = req.body;

    const trackingData = payload?.tracking_data;
    const shipmentTrack = trackingData?.shipment_track?.[0];

    if (!shipmentTrack) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    const shipmentId = shipmentTrack.shipment_id;
    const currentStatus = shipmentTrack.current_status;

    const mappedStatus = mapShiprocketStatusToOrderStatus(currentStatus);

    // 🔹 Order + User fetch
    const fullOrder = await Order.findOne({
      where: { shipment_id: shipmentId },
      include: [{ model: User }],
    });

    if (!fullOrder || !fullOrder.User) {
      return res.status(404).json({ message: "Order/User not found" });
    }

    const userPhone = fullOrder.User.phone;
    const userName = fullOrder.User.name;

    // 🔹 DB update
    await Order.update(
      { order_status: mappedStatus },
      { where: { shipment_id: shipmentId } }
    );

    // 🔹 STATUS BASED SMS
    if (mappedStatus === "shipped") {
      const smsResShiped = await sendSMS(
        userPhone,
        `Hi ${userName}, your order ${shipmentId} has been shipped and is on its way! Thank you for shopping with Stylekins Pvt. Ltd.`
      );
      console.log("📦 Shipped SMS sent", smsResShiped);
    }

    if (mappedStatus === "delivered") {
      const smsResDelivered = await sendSMS(
        userPhone,
        `Hi ${userName}, your order ${shipmentId} has been delivered. We hope you love your purchase! Thank you for shopping with Stylekins Pvt. Ltd.!`
      );
      console.log("✅ Delivered SMS sent", smsResDelivered);
    }

    console.log("Webhook Updated:", {
      shipmentId,
      currentStatus,
      mappedStatus,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: "Webhook failed" });
  }
});


// API Routes
app.use("/api/user", userIndexRoutes);
app.use("/api/vendor", vendorIndexRoutes);
app.use("/api/admin", adminIndexRoutes);
app.use("/api/product", productFormRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/xpressbees", xpressbeesRoutes);
app.use("/api/contact", contactRoutes);

export default app;
