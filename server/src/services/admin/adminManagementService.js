import { User } from "../../models/userModel.js";
import { Vendor } from "../../models/vendorModel.js";
import { Product } from "../../models/productModel.js"
import { Order } from "../../models/orderModel.js"
import { Payment } from "../../models/paymentModel.js"
import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../../config/db.js";


// admin dashboard Management
export const getAdminDashboardService = async () => {
  try {
    const totalUsers = await User.count();
    const totalVendors = await Vendor.count();
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    const [results] = await sequelize.query(`
      SELECT 
        o.product_id,
        p.brand,
        p.product_type,
        p.front_photo,
        p.selling_price,
        p.additional_info,
        p.status,
        p.stock,
        p.stock_status,
        SUM(o.quantity) AS totalSales
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE p.status = 'approved'
      GROUP BY o.product_id
      ORDER BY totalSales DESC
      LIMIT 5;
    `);

    const topProducts = results.map(item => ({
      id: item.product_id,
      name: `${item.product_type || ""}`.trim(),
      img: item.front_photo || null,
      sales: Number(item.totalSales),
      price: item.selling_price || null,
      info: item.additional_info || null,
      status: item.status || null,
      stock: item.stock,
      stock_status: item.stock_status || null,
    }));

    return {
      total_users: totalUsers || 0,
      total_vendors: totalVendors || 0,
      total_products: totalProducts || 0,
      total_orders: totalOrders || 0,
      top_products: topProducts,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// user management Service
export const getAllUsers = async ({ search, page, limit }) => {
  const offset = (page - 1) * limit;

  const where = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ],
    }
    : {};

  const { count, rows } = await User.findAndCountAll({
    where,
    offset,
    limit,
    order: [["created_at", "DESC"]],
  });

  return { total: count, users: rows };
};

// vendor management Service
// Get all vendors with search, status filter, pagination
export const getAllVendorsService = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;
  const where = {};

  // Search filter (name, email, phone)
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  // Status filter
  if (status && status.toLowerCase() !== "all") {
    where.status = status.toLowerCase();
  }

  const { count, rows } = await Vendor.findAndCountAll({
    where,
    offset,
    limit,
    order: [["created_at", "DESC"]],
    attributes: ["id", "name", "email", "phone", "status", "created_at"],
    raw: true, 
    useMaster: true,
  });

  return { total: count, vendors: rows };
};

// Get vendor by ID
export const getVendorByIdService = async (id) => {
  return Vendor.findByPk(id);
};

// Update vendor status
export const updateVendorStatusService = async (id, status) => {
  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status.toLowerCase())) return null;
  const vendor = await Vendor.findByPk(id);
  if (!vendor) throw new Error("Vendor not found");
  vendor.status = status;
  await vendor.save();
  await vendor.reload();
  return vendor;
};

export const adminUpdateProductService  = async (productId, vendorId, data, images) => {
  const t = await sequelize.transaction();
  try {
    const product = await Product.findOne({
      where: { id: productId, vendor_id: vendorId },
      transaction: t,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // === RECALCULATE SKU ONLY IF product_group OR product_type CHANGES ===
    let sku = product.sku;

    const shouldRegenerateSku =
      data.product_group?.trim() !== product.product_group ||
      data.product_type?.trim() !== product.product_type;

    if (shouldRegenerateSku) {
      const cleanGroup = (data.product_group || "XX").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2);
      const cleanType = (data.product_type || "XX").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2);
      const prefix = `SA/${cleanGroup}/${cleanType}`;

      const lastProduct = await Product.findOne({
        where: {
          sku: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("sku")),
            "LIKE",
            `${prefix.toLowerCase()}%`
          ),
          id: { [Op.ne]: productId },
        },
        order: [["id", "DESC"]],
        attributes: ["sku"],
        transaction: t,
      });

      let nextNumber = 1;
      if (lastProduct?.sku) {
        const match = lastProduct.sku.match(/(\d+)$/);
        if (match) nextNumber = parseInt(match[1], 10) + 1;
      }

      sku = `${prefix}/${String(nextNumber).padStart(2, "0")}`;
    }

    // === PREPARE UPDATE DATA ===
    const updateData = {
      category_id: data.category_id ? parseInt(data.category_id, 10) : product.category_id,
      product_group: data.product_group?.trim() || product.product_group,
      product_type: data.product_type?.trim() || product.product_type,
      product_condition: data.product_condition || product.product_condition,
      fit: data.fit || product.fit,
      product_color: data.product_color?.trim() || product.product_color,
      brand: data.brand?.trim() || product.brand,
      model_name: data.model_name?.trim() ?? product.model_name,

      invoice: data.invoice || product.invoice,
      needs_repair: data.needs_repair || product.needs_repair,
      original_box: data.original_box || product.original_box,
      dust_bag: data.dust_bag || product.dust_bag,

      additional_items: data.additional_items?.trim() ?? product.additional_items,
      reason_to_sell: data.reason_to_sell?.trim() ?? product.reason_to_sell,
      purchase_place: data.purchase_place?.trim() ?? product.purchase_place,
      product_link: data.product_link?.trim() ?? product.product_link,
      additional_info: data.additional_info?.trim() ?? product.additional_info,

      purchase_price: data.purchase_price ? parseInt(data.purchase_price, 10) : product.purchase_price,
      selling_price: data.selling_price ? parseInt(data.selling_price, 10) : product.selling_price,
      purchase_year: data.purchase_year ? parseInt(data.purchase_year, 10) : product.purchase_year,

      // Images - only update if new file uploaded
      front_photo: images.front_photo,
      back_photo: images.back_photo,
      label_photo: images.label_photo,
      inside_photo: images.inside_photo,
      button_photo: images.button_photo,
      wearing_photo: images.wearing_photo,
      invoice_photo: images.invoice_photo,
      repair_photo: images.repair_photo,
      more_images: images.more_images,

      // SKU & Status
      sku,
      status: product.status === "approved" ? "pending" : product.status, // Re-review if was approved
    };

    // === HANDLE SIZE ===
    if (data.size && data.size !== "Other") {
      updateData.size = data.size;
      updateData.size_other = null;
    } else if (data.size === "Other") {
      updateData.size = "Other";
      updateData.size_other = data.size_other?.trim() || null;
    } else {
      // If size removed
      updateData.size = null;
      updateData.size_other = null;
    }

    // === UPDATE PRODUCT ===
    await product.update(updateData, { transaction: t });

    await t.commit();

    return await Product.findByPk(productId, {
      include: [
        { model: Category, as: "category" },
        { model: Vendor, as: "vendor", attributes: { exclude: ["password"] } },
      ],
    });
  } catch (error) {
    await t.rollback();
    console.error("updateProductService Error:", error);
    throw new Error(error.message || "Failed to update product");
  }
};


// vendor details page
export const getVendorById = async (id) => {
  const vendor = await Vendor.findByPk(id); // Sequelize method
  return vendor;
};

// product management Service
// Fetch all products with filters & pagination
export const getAllProductsService = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;

  const where = {};

  // Search filter
  if (search) {
    where[Op.or] = [
      { product_type: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
    ];
  }

  // Status filter
  if (status && status.toLowerCase() !== "all") {
    where.status = status.toLowerCase();
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    offset,
    limit,
    order: [["created_at", "DESC"]],
    // attributes: ["id", "sku", "product_type", "brand", "selling_price", "status"],
  });

  return { total: count, products: rows };
};

// Get product by ID
export const getProductByIdService = async (id) => {
  const product = await Product.findByPk(id);
  return product;
};

// Update product status (approve/reject)
export const updateProductStatusService = async (id, status) => {
  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status.toLowerCase())) return null;

  const product = await Product.findByPk(id);
  if (!product) return null;

  product.status = status.toLowerCase();
  await product.save();
  return product;
};

// orders management Service
export const getAllOrdersService = async ({ order_id, status, start_date, end_date, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  // Build WHERE clause dynamically
  const where = {};
  if (order_id) where.id = order_id;
  if (status && status !== "all") where.order_status = status;

  if (start_date && end_date) {
    const start = new Date(start_date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(end_date);
    end.setHours(23, 59, 59, 999);
    where.order_date = { [Op.between]: [start, end] };
  } else if (start_date) {
    const start = new Date(start_date);
    start.setHours(0, 0, 0, 0);
    where.order_date = { [Op.gte]: start };
  } else if (end_date) {
    const end = new Date(end_date);
    end.setHours(23, 59, 59, 999);
    where.order_date = { [Op.lte]: end };
  }

  // Fetch orders with User & Product
  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      { model: User, attributes: ["name"] },
      { model: Vendor, attributes: ["name"] },
      { model: Product, as: "product", attributes: ["id", "product_type", "brand", "selling_price", "front_photo"] },
    ],
    order: [["created_at", "DESC"]],
    offset,
    limit,
  });

  // Status counts
  const countsRaw = await Order.findAll({
    attributes: ["order_status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    group: ["order_status"],
  });

  const counts = { total: count };
  countsRaw.forEach(c => {
    counts[c.order_status] = parseInt(c.get("count"));
  });

  const totalPages = Math.ceil(count / limit);

  return { orders: rows, counts, pagination: { totalPages, currentPage: page } };
};

export const getOrderDetailsService = async (id) => {
  try {
    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "name",
            "email",
            "phone",
            "address_line",
            "city",
            "state",
            "pincode",
          ],
        },
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "brand",
            "model_name",
            "product_condition",
            "size",
            "product_color",
            "selling_price",
            "front_photo",
            "product_type",
            "product_group",
          ],
          include: [
            {
              model: Vendor,
              as: "vendor",
              attributes: [
                "id",
                "name",
                "business_name",
                "business_type",
                "phone",
                "email",
              ],
            },
          ],
        },
        {
          model: Vendor,
          attributes: [
            "id",
            "name",
            "business_name",
            "business_type",
            "phone",
            "email",
          ],
        },
      ],
    });

    if (!order) return null;

    const user = order.User || {};
    const product = order.product || {};
    const vendor = product.vendor || order.Vendor || {};

    return {
      order_id: order.id,
      order_date: order.order_date,
      order_status: order.order_status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      transaction_id: order.transaction_id,
      total_amount: Number(order.total_amount) || 0,
      quantity: order.quantity,
      shipping_address: order.shipping_address,

      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: [
          user.address_line,
          user.city,
          user.state,
          user.pincode ? `- ${user.pincode}` : "",
        ]
          .filter(Boolean)
          .join(", "),
      },

      product: {
        id: product.id,
        brand: product.brand,
        model_name: product.model_name,
        condition: product.product_condition,
        size: product.size,
        color: product.product_color,
        selling_price: Number(product.selling_price) || 0,
        image: product.front_photo,
        group: product.product_group,
        type: product.product_type,
      },

      vendor: {
        id: vendor.id,
        name: vendor.name,
        business_name: vendor.business_name,
        business_type: vendor.business_type,
        phone: vendor.phone,
        email: vendor.email,
      },
    };
  } catch (error) {
    console.error("Error in getOrderDetailsService:", error);
    throw error;
  }
};

// payment management
export const getPaymentsWithFiltersService = async ({ transaction_id, status, start_date, end_date, page = 1, limit = 10 }) => {
  try {
    const where = {};

    // Filter by transaction_id
    if (transaction_id) {
      where.transaction_id = { [Op.like]: `%${transaction_id}%` };
    }

    // Filter by status
    if (status && status.toLowerCase() !== "all") {
      where.payment_status = status.toLowerCase();
    }

    // Filter by payment_date
    if (start_date && end_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);

      where.payment_date = { [Op.between]: [start, end] };
    } else if (start_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);
      where.payment_date = { [Op.gte]: start };
    } else if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      where.payment_date = { [Op.lte]: end };
    }

    const offset = (page - 1) * limit;

    // Fetch paginated payments
    const { count, rows } = await Payment.findAndCountAll({
      where,
      limit,
      offset,
      order: [["payment_date", "DESC"]],
      attributes: [
        "id",
        "order_id",
        "user_id",
        "vendor_id",
        "amount",
        "vendor_earning",
        "platform_fee",
        "currency",
        "payment_status",
        "payment_method",
        "transaction_id",
        "payment_date",
      ],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      payments: rows,
      total: count,
      totalPages,
    };
  } catch (err) {
    throw new Error(err.message || "Error fetching payments");
  }
};

export const getPaymentCommissionService = async (vendorId) => {
  const where =
    vendorId === "all" ? {} : { vendor_id: vendorId };

  /* =======================
     1️⃣ STATS (FINAL & CORRECT)
  ======================= */
  const stats = await Payment.findOne({
    where,
    attributes: [
      // ✅ Total unique orders (all statuses)
      [fn("COUNT", fn("DISTINCT", col("order_id"))), "totalOrders"],

      // ✅ Total product amount (SUCCESS only)
      [
        literal(`
          SUM(
            CASE
              WHEN payment_status = 'success'
              THEN amount
              ELSE 0
            END
          )
        `),
        "totalAmount",
      ],

      // ✅ Admin commission (SUCCESS only)
      [
        literal(`
          SUM(
            CASE
              WHEN payment_status = 'success'
              THEN admin_commission
              ELSE 0
            END
          )
        `),
        "adminCommission",
      ],

      // ✅ Vendor payout (SUCCESS only)
      [
        literal(`
          SUM(
            CASE
              WHEN payment_status = 'success'
              THEN vendor_earning
              ELSE 0
            END
          )
        `),
        "vendorPayout",
      ],

      // 🟡 Pending product amount
      [
        literal(`
          SUM(
            CASE
              WHEN payment_status = 'pending'
              THEN amount
              ELSE 0
            END
          )
        `),
        "totalPendingAmount",
      ],

      // 🔴 Failed product amount
      [
        literal(`
          SUM(
            CASE
              WHEN payment_status = 'failed'
              THEN amount
              ELSE 0
            END
          )
        `),
        "totalFailedAmount",
      ],

      // ✅ Operational fees (shipping + platform)
      [
        literal(`
          SUM(IFNULL(shipping_fee,0))
          + SUM(IFNULL(platform_fee,0))
        `),
        "operationalFees",
      ],

      // ✅ Total admin revenue
      // = admin commission (success) + all fees
      [
        literal(`
          SUM(
            CASE
              WHEN payment_status = 'success'
              THEN admin_commission
              ELSE 0
            END
          )
          + SUM(IFNULL(shipping_fee,0))
          + SUM(IFNULL(platform_fee,0))
        `),
        "totalAdminRevenue",
      ],
    ],
    raw: true,
  });

  /* =======================
     2️⃣ PAYMENTS LIST
  ======================= */
  const payments = await Payment.findAll({
    where,
    attributes: [
      "id",
      "order_id",
      "amount",           // product total only
      "admin_commission", // 30% of product
      "vendor_earning",   // 70% of product
      "payment_status",
      "transaction_id",
      [fn("DATE", col("payment_date")), "payment_date"],
    ],
    order: [["created_at", "DESC"]],
    raw: true,
  });

  /* =======================
     3️⃣ VENDORS
  ======================= */
  const vendors = await Vendor.findAll({
    attributes: ["id", "name"],
    raw: true,
  });

  return {
    stats,
    payments,
    vendors,
  };
};