import { sequelize } from "../../config/db.js";
import { Order } from "../../models/orderModel.js";
import { Product } from "../../models/productModel.js";


export const getUserOrderService = async (userId, searchQuery = null, page = 1, limit = 10) => {
  try {
    let queryOptions = {
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["front_photo", "selling_price", "product_type"],
        },
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['order_date', 'DESC']], // Optional: sort by date descending
    };

    if (searchQuery) {
      queryOptions = {
        ...queryOptions,
        include: [
          {
            model: Product,
            where: {
              product_group: { [sequelize.Op.like]: `%${searchQuery}%` },
            },
            attributes: ["front_photo", "selling_price", "product_type"],
          },
        ],
      };
    }

    const { count, rows } = await Order.findAndCountAll(queryOptions);
    
    return {
      orders: rows.map(order => ({
        id: order.id,
        productName: order.product?.product_type || "N/A",
        price: order.product?.selling_price || order.total_amount,
        quantity: order.quantity,
        order_status: order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1).replace(/_/g, " "),
        order_date: order.order_date ? new Date(order.order_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) : "N/A",
        payment_status: order.payment_status,
        shipping_address: order.shipping_address,
        front_photo: order.product?.front_photo || null,
      })),
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    throw new Error("Error fetching user orders: " + error.message);
  }
};

