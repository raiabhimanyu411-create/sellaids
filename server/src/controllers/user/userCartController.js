import { addToCartService, getCartService, updateCartQuantityService, removeFromCartService } from "../../services/user/userCartService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

export const addToCartController = async (req, res) => {
  try {
    if (!req.body) {
      logger.warn("Missing request body in addToCart");
      return res.status(400).json({ success: false, message: "Request body is missing" });
    }
    const { product_id } = req.body;
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized cart add attempt");
      return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
    }
    if (!product_id) {
      logger.warn("Missing product_id in addToCart");
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const result = await addToCartService(userId, product_id);

    if (!result.status) {
      return res.status(200).json({
        success: false,
        message: result.message,
      });
    }

    logger.info(`Cart add successful for user ${userId}`);
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`addToCartController Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getCartController = async (req, res) => {
  try {
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized cart fetch attempt");
      return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
    }

    const result = await getCartService(userId);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message || "Failed to fetch cart" });
    }

    logger.info(`Cart fetched successfully for user ${userId}`);
    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`getCartController Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateCartQuantityController = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized cart update attempt");
      return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
    }
    if (!product_id) {
      logger.warn("Missing product_id in updateCartQuantity");
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    if (quantity === undefined || quantity < 0) {
      logger.warn("Invalid quantity in updateCartQuantity");
      return res.status(400).json({ success: false, message: "Valid quantity is required" });
    }

    const result = await updateCartQuantityService(userId, product_id, quantity);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message || "Failed to update cart quantity" });
    }

    logger.info(`Cart quantity updated for user ${userId}, product ${product_id}`);
    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`updateCartQuantityController Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const removeFromCartController = async (req, res) => {
  try {
    const { product_id } = req.params;
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized cart remove attempt");
      return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
    }
    if (!product_id) {
      logger.warn("Missing product_id in removeFromCart");
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const result = await removeFromCartService(userId, product_id);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message || "Failed to remove from cart" });
    }

    logger.info(`Cart item removed for user ${userId}, product ${product_id}`);
    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`removeFromCartController Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};