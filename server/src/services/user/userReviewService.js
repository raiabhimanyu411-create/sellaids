import logger from "../../config/logger.js";
import { Review } from "../../models/reviewModel.js";
import { Order } from "../../models/orderModel.js";
import { sequelize } from "../../config/db.js";
import { User } from "../../models/userModel.js";
import { Product } from "../../models/productModel.js"
import { Op } from "sequelize";

export const addReviewService = async (userId, product_id, rating, review_text) => {
  try {
    logger.info(`Adding review for product ${product_id} by user ${userId}`);

    // Check if user purchased and received
    const hasPurchased = await Order.findOne({
      where: { user_id: userId, product_id, order_status: "delivered" },
    });

    if (!hasPurchased) {
      return { status: false, message: "You can only review purchased products." };
    }

    // Prevent duplicate
    const existing = await Review.findOne({ where: { user_id: userId, product_id } });
    if (existing) {
      return { status: false, message: "You have already reviewed this product." };
    }

    const review = await Review.create({
      product_id,
      user_id: userId,
      rating,
      review_text: review_text?.trim() || null,
    });

    return { status: true, data: review };
  } catch (error) {
    logger.error(`addReviewService Error: ${error.message}`);
    throw error;
  }
};

export const getProductReviewsService = async (productId, page = 1, limit = 10) => {
  try {
    logger.info(`Fetching reviews for product ${productId}, page ${page}`);

    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { product_id: productId },
      include: [
        {
          model: User,
          attributes: ["name"],
          as: "user",
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const avgResult = await Review.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avg"]],
      where: { product_id: productId },
      raw: true,
    });

    const average_rating = avgResult?.avg ? parseFloat(avgResult.avg).toFixed(1) : "0";

    return {
      status: true,
      data: {
        reviews: rows,
        average_rating,
        total_reviews: count,
        page,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    logger.error(`getProductReviewsService Error: ${error.message}`);
    throw error;
  }
};

export const getAllReviewsService = async (search = "", page = 1, limit = 20) => {
  try {
    logger.info(`Fetching ALL reviews – page ${page}, limit ${limit}, search: ${search}`);

    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { "$user.name$": { [Op.like]: `%${search}%` } },
        { "$product.product_type$": { [Op.like]: `%${search}%` } },
        { "$product.model_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Review.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ["name"],
          as: "user",
        },
        {
          model: Product,
          attributes: ["product_type", "model_name"],
          as: "product",
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const avgResult = await Review.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avg"]],
      raw: true,
    });

    const average_rating = avgResult?.avg ? parseFloat(avgResult.avg).toFixed(1) : "0";

    return {
      status: true,
      data: {
        reviews: rows,
        average_rating,
        total_reviews: count,
        page,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    logger.error(`getAllReviewsService Error: ${error.message}`);
    throw error;
  }
};

export const deleteReviewService = async (reviewId) => {
  try {
    logger.info(`Deleting review ID ${reviewId}`);

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return { status: false, message: "Review not found" };
    }

    await review.destroy();
    return { status: true, data: null };
  } catch (error) {
    logger.error(`deleteReviewService Error: ${error.message}`);
    throw error;
  }
};