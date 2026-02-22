import express from "express";
import {
  addReviewController,
  getProductReviewsController,
  deleteReviewController,
  getAllReviewsController,
} from "../../controllers/user/userReviewController.js";
import { isUserLoginIn, isAdminLoginIn } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/", isUserLoginIn, addReviewController);

router.get("/product/:productId", getProductReviewsController);

router.get("/", getAllReviewsController);

router.delete("/:reviewId", isAdminLoginIn, deleteReviewController);

export default router;