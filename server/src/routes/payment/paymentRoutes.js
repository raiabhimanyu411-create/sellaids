import express from "express";
import { createOrderController, verifyPaymentController, cancelPaymentController, getLatestOrder } from "../payment/paymentController.js";
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/create-order", isUserLoginIn, createOrderController);
router.post("/verify", isUserLoginIn, verifyPaymentController);
router.post("/cancel", isUserLoginIn, cancelPaymentController);
router.get("/user/:userId/latest-order", isUserLoginIn, getLatestOrder);


export default router;