import express from "express";
import { createShipmentController, trackShipmentController } from "./xpressbeesController.js";

const router = express.Router();

// Create shipment after payment success
router.post("/create", createShipmentController);

// Track shipment (for admin or CRON)
router.get("/track/:awb", trackShipmentController);

export default router;