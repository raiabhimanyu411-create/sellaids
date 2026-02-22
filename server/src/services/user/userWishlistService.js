import { Wishlist } from "../../models/userWishlistModel.js";
import logger from "../../config/logger.js";
import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";

export const addToWishlistService = async (userId, productId) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      logger.warn(`Product ${productId} not found`);
      return { status: false, message: "Product not found" };
    }

    if (product.stock <= 0 || product.stock_status === "out_of_stock") {
      return {
        status: false,
        message: "Product is out of stock",
      };
    }

    const existing = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existing) {
      // If product already in wishlist, do nothing and return success
      logger.info(`Product ${productId} already in wishlist for user ${userId}`);
      return {
        status: false,
        message: "Product already in wishlist",
      };
    }

    const newItem = await Wishlist.create({
      user_id: userId,
      product_id: productId,
    });

    logger.info(`Product ${productId} successfully added to wishlist`);
    return { status: true, data: newItem, action: "added" };
  } catch (error) {
    logger.error(`Error in addToWishlistService: ${error.message}`);
    throw new Error("Failed to add product to wishlist");
  }
};

export const removeFromWishlistService = async (userId, productId) => {
  try {
    const deleted = await Wishlist.destroy({
      where: { user_id: userId, product_id: productId },
    });

    if (!deleted) {
      return { success: false, message: "Product not found in wishlist" };
    }

    logger.info(`Wishlist removed: user ${userId}, product ${productId}`);
    return { success: true };
  } catch (error) {
    logger.error("Error in removeFromWishlistService:", error);
    throw error;
  }
};

export const getAllWishlistService = async (userId) => {
  try {
    logger.info(`Fetching wishlist for user ${userId}`);
    const items = await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",  // ADD THIS
          attributes: [
            'id', 'product_type', 'selling_price',
            'front_photo', 'back_photo', 'label_photo',
            'inside_photo', 'button_photo', 'wearing_photo', 'more_images'
          ],
        },
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
    });

    logger.info(`Fetched ${items.length} items from wishlist`);
    return {
      status: true,
      data: items.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        created_at: item.created_at,
        product: item.product ? {  // Now it's `item.product` (lowercase)
          id: item.product.id,
          name: item.product.product_type,
          price: item.product.selling_price,
          front_photo: item.product.front_photo,
          back_photo: item.product.back_photo,
          label_photo: item.product.label_photo,
          inside_photo: item.product.inside_photo,
          button_photo: item.product.button_photo,
          wearing_photo: item.product.wearing_photo,
          more_images: item.product.more_images,
        } : null,
        user: item.user ? {
          id: item.user.id,
          name: item.user.name,
        } : null,
      })),
    };
  } catch (error) {
    logger.error(`Error in getAllWishlistService: ${error.message}`);
    throw new Error("Failed to fetch wishlist");
  }
};