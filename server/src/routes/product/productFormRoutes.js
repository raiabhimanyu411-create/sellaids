import express from "express";
import {
  addProductController,
  getCategories,
  getProductTypes,
  getAllProductsController,
  getProductByIdController,
  getDashboardController,
  getEarningsController,
  updateProductController,
  bulkUploadProducts,
  getAllProductsPublicController,
} from "../../controllers/product/productFormController.js";

import {
  isVendorLoginIn,
  isVendorOrAdminLoggedIn,
} from "../../middlewares/authMiddlewares.js";

//  CHANGE HERE
import { uploadCloud } from "../../middlewares/productUploadCloud.js";

import { uploadExcel } from "../../middlewares/uploadExcel.js";

const router = express.Router();

//  CHANGE HERE (upload → uploadCloud)
export const uploadFields = uploadCloud.fields([
  { name: "front_photo", maxCount: 1 },
  { name: "back_photo", maxCount: 1 },
  { name: "label_photo", maxCount: 1 },
  { name: "inside_photo", maxCount: 1 },
  { name: "button_photo", maxCount: 1 },
  { name: "wearing_photo", maxCount: 1 },
  { name: "invoice_photo", maxCount: 1 },
  { name: "repair_photo", maxCount: 1 },
  { name: "more_images", maxCount: 10 },
]);

// ==================== Public Routes ====================
router.get("/shop/all-products", getAllProductsPublicController);
router.get("/products/:id", getProductByIdController);
router.get("/categories-list", getCategories);
router.get("/", getProductTypes);

// ==================== Vendor Routes ====================
router.post("/add", isVendorLoginIn, uploadFields, addProductController);

router.put(
  "/:id",
  isVendorOrAdminLoggedIn,
  uploadFields,
  updateProductController
);

router.get(
  "/products-list",
  isVendorOrAdminLoggedIn,
  getAllProductsController
);

router.get("/dashboard", isVendorLoginIn, getDashboardController);
router.get("/earnings", getEarningsController);

router.post("/bulk-upload", uploadExcel, bulkUploadProducts);

export default router;