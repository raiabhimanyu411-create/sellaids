import XLSX from "xlsx";
import { Op, Sequelize } from "sequelize";
import { sequelize } from "../../config/db.js";
import { Product } from "../../models/productModel.js";
import { Category } from "../../models/categoryModel.js";
import ProductType from "../../models/productType.js";
import { Order } from "../../models/orderModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Vendor } from "../../models/vendorModel.js";




export const createProductService = async (vendorId, data, images) => {
  try {
    // === STEP 1: Generate SKU ===
    const cleanGroup = (data.product_group || "XX")
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 2);

    const cleanType = (data.product_type || "XX")
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 2);

    const prefix = `SA/${cleanGroup}/${cleanType}`;

    // Find last product with same prefix
    const lastProduct = await Product.findOne({
      where: {
        sku: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("sku")),
          "LIKE",
          `${prefix.toLowerCase()}%`
        ),
      },
      order: [["id", "DESC"]],
      attributes: ["sku"],
    });

    // Generate next number
    let nextNumber = 1;
    if (lastProduct?.sku) {
      const match = lastProduct.sku.match(/(\d+)$/);
      if (match) nextNumber = parseInt(match[1], 10) + 1;
    }

    const sku = `${prefix}/${String(nextNumber).padStart(2, "0")}`;

    // === STEP 2: Prepare Final Product Data ===
    const productData = {
      // Core fields
      vendor_id: vendorId,
      category_id: parseInt(data.category_id, 10),
      product_group: data.product_group?.trim() || null,
      product_type: data.product_type?.trim() || null,
      product_condition: data.product_condition || "new",
      fit: data.fit || "Regular",
      product_color: data.product_color?.trim() || null,
      brand: data.brand?.trim() || null,
      model_name: data.model_name?.trim() || null,

      // Yes/No fields
      invoice: data.invoice || "No",
      needs_repair: data.needs_repair || "No",
      original_box: data.original_box || "No",
      dust_bag: data.dust_bag || "No",

      // Optional text
      additional_items: data.additional_items?.trim() || null,
      reason_to_sell: data.reason_to_sell?.trim() || null,
      purchase_place: data.purchase_place?.trim() || null,
      product_link: data.product_link?.trim() || null,
      additional_info: data.additional_info
  ? JSON.stringify(JSON.parse(data.additional_info))
  : null,

      // Prices & Year
      purchase_price: data.purchase_price
        ? parseInt(data.purchase_price, 10)
        : null,
      selling_price: data.selling_price
        ? parseInt(data.selling_price, 10)
        : null,
      purchase_year: data.purchase_year
        ? parseInt(data.purchase_year, 10)
        : null,

      // === SIZE LOGIC ===
      size: null,
      size_other: null,

      // === IMAGES - Now storing direct Cloudinary URLs ===
      front_photo: images.front_photo || null,
      back_photo: images.back_photo || null,
      label_photo: images.label_photo || null,
      inside_photo: images.inside_photo || null,
      button_photo: images.button_photo || null,
      wearing_photo: images.wearing_photo || null,
      invoice_photo: images.invoice_photo || null,
      repair_photo: images.repair_photo || null,
      more_images: images.more_images || [],

      // Generated
      sku,
      status: "pending",
      is_active: true,
    };

    // === HANDLE SIZE & size_other ===
    if (data.size && data.size !== "Other") {
      productData.size = data.size;
    } else if (data.size === "Other") {
      productData.size = "Other";
      if (data.size_other?.trim()) {
        productData.size_other = data.size_other.trim();
      }
    }
    // If size is empty or invalid → remains null

    // === STEP 3: Create Product in DB ===
    const product = await Product.create(productData);

    return product;
  } catch (error) {
    console.error("createProductService Error:", error);
    throw new Error(error.message || "Failed to create product");
  }
};

export const updateProductService = async (productId, vendorId, data, images, isAdmin = false) => {
  const t = await sequelize.transaction();
  try {
    const product = await Product.findOne({
      where: isAdmin ? { id: productId } : { id: productId, vendor_id: vendorId },
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

      // Images - now using direct Cloudinary URLs
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
      status: isAdmin
        ? data.status || product.status : product.status === "approved" ? "pending" : product.status, // Re-review if was approved
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

export const fetchCategories = async (search = "", selectedGroup = "") => {
  return Category.findAll({
    where: {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
      ...(selectedGroup && {
        [Op.and]: sequelize.where(
          sequelize.fn('JSON_SEARCH', sequelize.col('group'), 'one', selectedGroup),
          'IS NOT',
          null
        )
      })
    },
    order: [["name", "ASC"]],
    attributes: ["id", "name"],
  });
};

export const fetchProductTypesByCategory = async (category_id, search = "") => {
  return await ProductType.findAll({
    where: {
      category_id,
      status: "active",
      type_name: { [Op.like]: `%${search}%` },
    },
    order: [["type_name", "ASC"]],
  });
};

export const getAllProductsService = async (query, vendorId, isAdmin) => {
  const { search, category_id, page = 1, limit = 10 } = query;

  const where = { is_active: true };

  // Vendor filter for non-admin users
  if (vendorId && !isAdmin) {
    where.vendor_id = vendorId;
  }

  if (category_id) {
    where.category_id = category_id;
  }

  if (search) {
    where[Op.or] = [
      { model_name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    offset,
    limit: parseInt(limit),
    order: [["created_at", "DESC"]],
    attributes: [
      "id",
      "sku",
      "product_group",
      "brand",
      "model_name",
      "selling_price",
      "status",
      "front_photo",
    ],
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: Vendor,
        as: "vendor",
        attributes: ["id", "name"],
      },
    ],
  });

  return {
    total: count,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
    products: rows,
  };
};

// ✅ FIXED: Removed CDN_BASE_URL - Using direct Cloudinary URLs from database
export const getAllProductsPublicService = async () => {
  try {
    const productsRaw = await Product.findAll({
      where: {
        is_active: true,
        status: "approved",
      },
      order: [["created_at", "DESC"]],
      attributes: [
        "id",
        "sku",
        "product_type",
        "product_group",
        "product_condition",
        "size",
        "size_other",
        "brand",
        "model_name",
        "selling_price",
        "front_photo",
        "more_images",
        "additional_info",
        "stock",
        "created_at",
      ],
      raw: true,
    });

    /* ===============================
       TRANSFORM PRODUCTS
    =============================== */
    const products = productsRaw.map((p) => {
      //  FIXED: Direct Cloudinary URL (already stored in database)
      let product_img = p.front_photo || null;

      // Fallback to first image in more_images if front_photo is null
      if (!product_img && p.more_images) {
        try {
          const parsed = JSON.parse(p.more_images);
          if (Array.isArray(parsed) && parsed.length) {
            product_img = parsed[0]; // Direct Cloudinary URL
          }
        } catch (_) {}
      }

      return {
        _id: p.id,
        sku: p.sku,
        product_name: p.model_name,
        product_group: p.product_group,
        product_img, // Direct Cloudinary URL
        product_additionalInfo: p.additional_info || "",
        product_price: p.selling_price,
        product_condition: p.product_condition,
        size: p.size,
        size_other: p.size_other,
        brand: p.brand,
        stock: p.stock,
      };
    });

    /* ===============================
       BUILD FILTERS FROM PRODUCTS
    =============================== */

    // 🔹 CONDITIONS (dynamic from DB)
    const product_conditions = Array.from(
      new Set(
        products
          .map((p) => p.product_condition)
          .filter(Boolean)
      )
    );

    // 🔹 SIZES (size + size_other split)
    const sizeSet = new Set();

    for (const p of products) {
      if (p.size?.toLowerCase() === "other" && p.size_other) {
        p.size_other
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => sizeSet.add(s));
      } else if (p.size) {
        sizeSet.add(p.size);
      }
    }

    const sizes = Array.from(sizeSet);

    /* ===============================
       FINAL RESPONSE (CATEGORY STYLE)
    =============================== */
    return {
      totalProducts: products.length,
      filters: {
        product_conditions,
        sizes,
      },
      products,
    };
  } catch (error) {
    throw error;
  }
};


export const getProductByIdService = async (id) => {
  const product = await Product.findOne({
    where: { id },
    include: [
      {
        model: Vendor,
        as: "vendor",
        attributes: {
          exclude: ["password", "reset_token", "reset_token_expires"],
        }, // security
      },
      {
        model: Category,
        as: "category",
      },
    ],
  });

  if (!product) return { product: null, related: [] };

  const relatedWhere = {
    id: { [Op.ne]: product.id },
    category_id: product.category_id,
    status: "approved",
    is_active: true,
  };

  const related = await Product.findAll({
    where: relatedWhere,
    limit: 6,
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Vendor,
        as: "vendor",
        attributes: {
          exclude: ["password", "reset_token", "reset_token_expires"],
        },
      },
      {
        model: Category,
        as: "category",
      },
    ],
  });

  return { product, related };
};

export const getDashboardStatsService = async (vendorId) => {
  try {
    const totalProducts = await Product.count({
      where: { vendor_id: vendorId, is_active: true },
    });

    const pendingOrders = await Order.count({
      where: { order_status: "pending", vendor_id: vendorId },
    });

    const totalEarnings = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, payment_status: "success" },
    });

    const thisMonthSales = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        payment_status: "success",
        payment_date: {
          [Op.between]: [
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(),
          ],
        },
      },
    });

    return {
      total_products: totalProducts || 0,
      pending_orders: pendingOrders || 0,
      total_earnings: totalEarnings || 0,
      this_month_sales: thisMonthSales || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getEarningsStatsService = async (vendorId) => {
  try {
    const completedEarning = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, payment_status: "success" },
    });

    const pendingEarning = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, payment_status: "pending" },
    });

    const failedOrRefundedEarning = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        payment_status: { [Op.in]: ["failed", "refunded"] },
      },
    });

    const thisMonthEarning = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        payment_status: "success",
        payment_date: {
          [Op.between]: [
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(),
          ],
        },
      },
    });

    const monthlyEarningSummary = await Payment.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("payment_date"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("SUM", sequelize.col("vendor_earning")), "total"],
      ],
      where: { vendor_id: vendorId, payment_status: "success" },
      group: ["month"],
      order: [[sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    return {
      completed_earning: completedEarning || 0,
      pending_earning: pendingEarning || 0,
      failed_or_refunded_earning: failedOrRefundedEarning || 0,
      this_month_earning: thisMonthEarning || 0,
      monthly_earning_summary: monthlyEarningSummary,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


const generateSKU = () =>
  "SKU-" + Math.random().toString(36).substr(2, 9).toUpperCase();

export const processBulkProducts = async (excelPath) => {
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    throw new Error("Excel file is empty");
  }

  let success = 0;
  let failed = [];

  for (let row of rows) {
    try {
      if (!row.vendor_id || !row.category_id || !row.product_group) {
        failed.push({ row, error: "Missing required fields" });
        continue;
      }

      const vendor = await Vendor.findByPk(row.vendor_id);
      if (!vendor) {
        failed.push({ row, error: "Vendor not found" });
        continue;
      }

      const category = await Category.findByPk(row.category_id);
      if (!category) {
        failed.push({ row, error: "Category not found" });
        continue;
      }

      await Product.create({
        vendor_id: row.vendor_id,
        category_id: row.category_id,
        product_group: row.product_group,
        product_type: row.product_type || null,
        product_condition: row.product_condition || "new",
        fit: row.fit || "Regular",
        size: row.size || "M",
        size_other: row.size_other || null,
        product_color: row.product_color || null,
        brand: row.brand || null,
        model_name: row.model_name || null,
        invoice: row.invoice || "No",
        invoice_photo: row.invoice_photo || null,
        needs_repair: row.needs_repair || "No",
        repair_photo: row.repair_photo || null,
        original_box: row.original_box || "No",
        dust_bag: row.dust_bag || "No",
        additional_items: row.additional_items || null,
        front_photo: row.front_photo || null,
        back_photo: row.back_photo || null,
        label_photo: row.label_photo || null,
        inside_photo: row.inside_photo || null,
        button_photo: row.button_photo || null,
        wearing_photo: row.wearing_photo || null,
        more_images: row.more_images ? JSON.parse(row.more_images) : null,
        purchase_price: row.purchase_price || 0,
        selling_price: row.selling_price || 0,
        reason_to_sell: row.reason_to_sell || null,
        purchase_year: row.purchase_year || null,
        purchase_place: row.purchase_place || null,
        product_link: row.product_link || null,
        additional_info: row.additional_info || null,
        status: "pending",
        sku: generateSKU(),
        is_active: true,
      });

      success++;
    } catch (err) {
      failed.push({ row, error: err.message });
    }
  }

  return {
    total: rows.length,
    success,
    failed: failed.length,
    failedRows: failed,
  };
};