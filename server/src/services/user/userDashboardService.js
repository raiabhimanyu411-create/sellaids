// services/user/userDashboardService.js

import { Order } from "../../models/orderModel.js";
import { Wishlist } from "../../models/userWishlistModel.js";
import { UserSupport } from "../../models/userSupportModel.js";
import { Product } from "../../models/productModel.js";
import { sequelize } from "../../config/db.js";

// Reusable include for Product
const includeProduct = {
  model: Product,
  as: "product",
  attributes: ["product_group"],
};

export const getDashboardStatsService = async (userId) => {
  try {
    /* ---------- BASIC KPI ---------- */
    const totalOrders = await Order.count({ where: { user_id: userId } });
    const pendingOrders = await Order.count({
      where: { user_id: userId, order_status: "pending" },
    });
    const wishlistItems = await Wishlist.count({ where: { user_id: userId } });
    const supportTickets = await UserSupport.count({ where: { user_id: userId } });

    /* ---------- ORDER TREND (last 6 months) ---------- */
    const orderTrends = await Order.findAll({
      where: { user_id: userId },
      attributes: [
        [sequelize.fn("DATE_FORMAT", sequelize.col("order_date"), "%Y-%m"), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("order_date"), "%Y-%m")],
      order: [[sequelize.fn("DATE_FORMAT", sequelize.col("order_date"), "%Y-%m"), "ASC"]],
      limit: 6,
      raw: true,
    });

    /* ---------- ORDER STATUS BREAKDOWN ---------- */
    const orderStatusBreakdown = await Order.findAll({
      where: { user_id: userId },
      attributes: [
        "order_status",
        [sequelize.fn("COUNT", sequelize.col("order_status")), "count"],
      ],
      group: ["order_status"],
      raw: true,
    });

    /* ---------- RECENT ACTIVITY ---------- */

    // 1. Recent Orders
    const recentOrders = await Order.findAll({
      where: { user_id: userId },
      attributes: ["id", "order_status", "created_at"],
      include: [includeProduct],
      order: [["created_at", "DESC"]],
      limit: 5,
      raw: true,
    });

    // 2. Recent Wishlist
    const recentWishlist = await Wishlist.findAll({
      where: { user_id: userId },
      attributes: ["created_at"],
      include: [includeProduct],
      order: [["created_at", "DESC"]],
      limit: 5,
      raw: true,
    });

    // 3. Recent Support Tickets — FIXED TO MATCH YOUR MODEL
    const recentTickets = await UserSupport.findAll({
      where: { user_id: userId },
      attributes: ["id", "title", "created_at"], // Only existing columns
      order: [["created_at", "DESC"]],
      limit: 5,
      raw: true,
    });

    // ---- Merge & sort activity ----
    const activity = [
      ...recentOrders.map((o) => ({
        description: `Order #${o.id} – ${capitalize(o.order_status)}`,
        time: formatRelative(o.created_at),
        type: "order",
      })),
      ...recentWishlist.map((w) => ({
        description: `Added "${w["product.product_group"]}" to wishlist`,
        time: formatRelative(w.created_at),
        type: "wishlist",
      })),
      ...recentTickets.map((t) => ({
        description: `Support: ${t.title}`, // Use 'title' instead of 'subject'
        time: formatRelative(t.created_at),
        type: "support",
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    return {
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      wishlist_items: wishlistItems,
      support_tickets: supportTickets,
      order_trends: orderTrends,
      order_status_breakdown: orderStatusBreakdown,
      recent_activity: activity,
    };
  } catch (error) {
    throw new Error("Error fetching dashboard KPIs: " + error.message);
  }
};

// Helper: capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper: human-readable time
function formatRelative(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = (now - d) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 604800)} weeks ago`;
}