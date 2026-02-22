import { productSchema, updateProductSchema } from "../../validations/productFormValidation.js";
import { createProductService, fetchCategories, fetchProductTypesByCategory, getAllProductsService, getProductByIdService, getDashboardStatsService, getEarningsStatsService, updateProductService, processBulkProducts, getAllProductsPublicService } from "../../services/product/productFormService.js";
import logger from "../../config/logger.js";
import { Product } from "../../models/productModel.js";



export const addProductController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Vendor session missing" });
    }

    await productSchema.validate(req.body, { abortEarly: false, context: { vendorId } });

    // ✅ FIXED: Use .path to get Cloudinary URLs instead of .filename
    const images = {
      front_photo: req.files?.front_photo?.[0]?.path || null,
      back_photo: req.files?.back_photo?.[0]?.path || null,
      label_photo: req.files?.label_photo?.[0]?.path || null,
      inside_photo: req.files?.inside_photo?.[0]?.path || null,
      button_photo: req.files?.button_photo?.[0]?.path || null,
      wearing_photo: req.files?.wearing_photo?.[0]?.path || null,
      invoice_photo: req.files?.invoice_photo?.[0]?.path || null,
      repair_photo: req.files?.repair_photo?.[0]?.path || null,
      more_images: req.files?.more_images?.map(f => f.path) || [],
    };

    console.log(" Images object:", images); // Check final URLs

    const product = await createProductService(vendorId, req.body, images);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
    }
    logger.error(error.message);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const adminId = req.session.admin?.adminId;
    const { id } = req.params;

    if (!vendorId && !adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Vendor session missing",
      });
    }

    // Check if product exists and belongs to this vendor
    let product;

    if (adminId) {
      product = await Product.findOne({
        where: { id, is_active: true },
      });
    } else {
      product = await Product.findOne({
        where: { id, vendor_id: vendorId, is_active: true },
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    // Validate using the new dedicated update schema
    await updateProductSchema.validate(req.body, {
      abortEarly: false,
      context: {
        vendorId,
        productId: id, // Critical: skip self in unique brand+model check
      },
    });

    // what Cloudinary is returning
    console.log("🔍 Uploaded files:", req.files?.front_photo?.[0]);

    //  Use .path for Cloudinary URLs, preserve old images if not re-uploaded
    const images = {
      front_photo: req.files?.front_photo?.[0]?.path || product.front_photo,
      back_photo: req.files?.back_photo?.[0]?.path || product.back_photo,
      label_photo: req.files?.label_photo?.[0]?.path || product.label_photo,
      inside_photo: req.files?.inside_photo?.[0]?.path || product.inside_photo,
      button_photo: req.files?.button_photo?.[0]?.path || product.button_photo,
      wearing_photo: req.files?.wearing_photo?.[0]?.path || product.wearing_photo,
      invoice_photo: req.files?.invoice_photo?.[0]?.path || product.invoice_photo,
      repair_photo: req.files?.repair_photo?.[0]?.path || product.repair_photo,
      more_images: req.files?.more_images?.length > 0
        ? req.files.more_images.map(f => f.path)
        : product.more_images || [],
    };

    const isAdmin = Boolean(adminId);
    // Call service to update
    const updatedProduct = await updateProductService(id, vendorId, req.body, images, isAdmin);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    logger.error(`Update Product Error (ID: ${req.params.id}): ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const adminId = req.session.admin?.adminId;
    if (!vendorId && !adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Valid session required" });
    }

    const { search = "", group = "" } = req.query;
    const categories = await fetchCategories(search, group);
    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getProductTypes = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const adminId = req.session.admin?.adminId;
    if (!vendorId && !adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Valid session required" });
    }

    const { category_id, search = "" } = req.query;

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "category_id is required",
      });
    }

    const productTypes = await fetchProductTypesByCategory(category_id, search);

    res.json({
      success: true,
      message: "Product types fetched successfully",
      data: productTypes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product types",
      error: error.message,
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const isAdmin = !!req.session.admin?.adminId;
    if (!vendorId && !isAdmin) {
      return res.status(401).json({ success: false, message: "Unauthorized: Valid session required" });
    }

    const data = await getAllProductsService(req.query, vendorId, isAdmin);

    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      ...data,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product list",
      error: err.message,
    });
  }
};

export const getAllProductsPublicController = async (req, res) => {
  try {
    const products = await getAllProductsPublicService();

    res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      total: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    // const vendorId = req.session.vendor?.vendorId;
    // const isAdmin = !!req.session.admin?.adminId;

    // if (!vendorId && !isAdmin) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Unauthorized: Valid session required" });
    // }

    const { id } = req.params;

    const { product, related } = await getProductByIdService(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product details fetched successfully",
      product,
      relatedProducts: related,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: err.message,
    });
  }
};

export const getDashboardController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Vendor session missing" });
    }

    const data = await getDashboardStatsService(vendorId);
    res.status(200).json({ success: true, msg: "Dashboard data fetched successfully", data });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

export const getEarningsController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Vendor session missing" });
    }

    const data = await getEarningsStatsService(vendorId);
    res.status(200).json({ success: true, msg: "Earnings data fetched successfully", data });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

export const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const report = await processBulkProducts(req.file.path);

    return res.status(200).json({
      message: "Bulk upload completed",
      ...report,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};