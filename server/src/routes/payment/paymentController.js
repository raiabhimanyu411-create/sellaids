import { createOrderService, verifyPaymentService, cancelPaymentService } from "../payment/paymentService.js";
import logger from "../../config/logger.js";
import { Order } from "../../models/orderModel.js";
import { Payment } from "../../models/paymentModel.js";

export const createOrderController = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not logged in or session expired" });
  }

  const { cartItems, shippingAddress, finalTotal } = req.body;

  try {
    const result = await createOrderService(userId, cartItems, shippingAddress, finalTotal);
    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Order created for user ${userId}`);
    return res.status(200).json({ success: true, message: "Order created", data: result.data });
  } catch (error) {
    logger.error(`createOrderController error for user ${userId}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const verifyPaymentController = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not logged in or session expired" });
  }

  const paymentDetails = req.body;

  try {
    const result = await verifyPaymentService(userId, paymentDetails);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Payment verified for user ${userId}`);
    return res.status(200).json({ success: true, message: "Payment verified successfully", data: result.data });
  } catch (error) {
    logger.error(`verifyPaymentController error for user ${userId}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const cancelPaymentController = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not logged in or session expired" });
  }

  const { razorpayOrderId, orderIds } = req.body;

  try {
    const result = await cancelPaymentService(userId, razorpayOrderId, orderIds);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Payment cancelled for user ${userId}`);
    return res.status(200).json({ success: true, message: "Payment cancelled successfully" });
  } catch (error) {
    logger.error(`cancelPaymentController error for user ${userId}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const getLatestOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.findAll({
      where: { user_id: userId, payment_status: "pending" },
      include: [
        {
          model: Payment,
          as: "payment",
          where: { payment_status: "pending" },
          required: true,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No pending order or payment found",
      });
    }

    const payment = orders[0].payment; 

    return res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: payment.razorpay_order_id,
        amount: payment.amount,              
        currency: payment.currency,
        key: process.env.RAZORPAY_KEY_ID,
        orderIds: orders.map((o) => o.id),    
      },
    });
  } catch (error) {
    logger.error(`getLatestOrder error for user ${req.params.userId}:`, error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};