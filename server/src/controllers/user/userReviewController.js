import {
  addReviewService,
  getProductReviewsService,
  deleteReviewService,
  getAllReviewsService,
} from "../../services/user/userReviewService.js";
import logger from "../../config/logger.js";

export const addReviewController = async (req, res) => {
  try {
    const { product_id, rating, review_text } = req.body;
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized review add attempt");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!product_id || !rating) {
      return res.status(400).json({ success: false, message: "Product ID and rating are required" });
    }

    const result = await addReviewService(userId, product_id, rating, review_text);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Review added by user ${userId} for product ${product_id}`);
    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`addReviewController Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getProductReviewsController = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const result = await getProductReviewsService(productId, page, limit);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Reviews fetched for product ${productId}`);
    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`getProductReviewsController Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getAllReviewsController = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; 
    const result = await getAllReviewsService(search, page, limit);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`All reviews fetched – ${search ? `, search: ${search}` : ""}, page ${page}`);
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`getAllReviewsController Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const adminId = req?.session?.admin?.adminId;

    if (!adminId) {
      logger.warn("Unauthorized review delete attempt");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await deleteReviewService(reviewId);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Review ${reviewId} deleted by admin ${adminId}`);
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`deleteReviewController Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};