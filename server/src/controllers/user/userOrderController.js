import { getUserOrderService } from "../../services/user/userOrderService.js";
import logger from "../../config/logger.js";

export const getOrderController = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not logged in or session expired" });
  }
  try {
    const searchQuery = req.query.search || null;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    
    const result = await getUserOrderService(userId, searchQuery, page, limit);
    logger.info(`Orders fetched for user: ${userId}`);
    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: {
        orders: result.orders,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      },
    });
  } catch (error) {
    logger.error(`Error fetching orders for user ${userId}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};