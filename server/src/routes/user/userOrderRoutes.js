import express from "express";
import { getOrderController } from "../../controllers/user/userOrderController.js";

const router = express.Router();

router.get("/list", getOrderController);

export default router;