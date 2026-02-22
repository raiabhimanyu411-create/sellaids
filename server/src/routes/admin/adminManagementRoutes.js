import express from "express";
import { getAdminDashboardController, getAllUsersController, getAllVendorsController, getVendorByIdController, updateVendorStatusController, getAllProductsController , getPaymentsController, getProductByIdController, updateProductStatusController, getAllOrders, getOrderDetails, getPaymentCommission, adminUpdateProductController } from "../../controllers/admin/adminManagementController.js";
import { uploadFields } from "../product/productFormRoutes.js";
import noCache from "../../middlewares/noCache.middleware.js";


const router = express.Router();

// dashboard
router.get("/dashboard", getAdminDashboardController);

// users management
router.get("/user", getAllUsersController);

// vendors management
// router.patch('/vendors/:id', updateVendorStatusController);
router.get("/vendor", noCache, getAllVendorsController); // Get all vendors
router.get("/vendor/:id", getVendorByIdController); // Get vendor details
router.patch("/vendor/:id/status", updateVendorStatusController); // Update vendor status

// products management
router.get("/product", noCache, getAllProductsController);
router.get("/product/:id", getProductByIdController);
router.patch("/product/:id/status", updateProductStatusController);
router.put("/product/:id", uploadFields, adminUpdateProductController);

// orders management
router.get("/order", getAllOrders);       
router.get("/order/:id", getOrderDetails);

// payment management 
router.get('/payment', getPaymentsController );

// payment commission
router.get("/payment-commission",getPaymentCommission);

export default router;
