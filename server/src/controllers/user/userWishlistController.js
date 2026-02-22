import {
    addToWishlistService,
    removeFromWishlistService,
    getAllWishlistService,
} from "../../services/user/userWishlistService.js";
import logger from "../../config/logger.js";
import { wishlistSchema } from "../../validations/wishlistValidation.js";

export const addToWishlist = async (req, res) => {
  try {
    if (!req.body) {
      logger.warn("Missing request body in addToWishlist");
      return res.status(400).json({ success: false, message: "Request body is missing" });
    }

    await wishlistSchema.validate(req.body, { abortEarly: false });

    const { product_id } = req.body;
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized wishlist add attempt");
      return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
    }

    const result = await addToWishlistService(userId, product_id);
    if (!result.status) {
      return res.status(200).json({
        success: false,
        message: result.message,
      });
    }

    logger.info(`Wishlist action (${result.action}) successful for user ${userId}`);
    return res.status(200).json({
      success: true,
      message: result.action === "added" ? "Product added to wishlist successfully" : "Product already in wishlist",
      data: result.data,
      action: result.action,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      logger.warn("Validation error in addToWishlist", { errors: error.errors });
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
    logger.error(`addToWishlistController Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.session?.user?.userId;

        if (!userId) {
            logger.warn("Unauthorized wishlist remove attempt");
            return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
        }

        if (!productId) {
            logger.warn("Missing productId in removeFromWishlist");
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const result = await removeFromWishlistService(userId, productId);
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message || "Failed to remove product" });
        }

        logger.info(`Wishlist remove successful for user ${userId}`);
        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
        });
    } catch (error) {
        logger.error(`removeFromWishlistController Error: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized wishlist fetch attempt");
      return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
    }

    const result = await getAllWishlistService(userId);
    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message || "Failed to fetch wishlist" });
    }

    logger.info(`Wishlist fetched for user ${userId}`);
    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`getWishlistController Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};