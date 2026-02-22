import { createShipmentService, trackShipmentService } from "./xpressbeesService.js";

export const createShipmentController = async (req, res) => {
  try {
    const order = req.body; // assume order object passed
    const result = await createShipmentService(order);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const trackShipmentController = async (req, res) => {
  try {
    const { awb } = req.params;
    const result = await trackShipmentService(awb);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};