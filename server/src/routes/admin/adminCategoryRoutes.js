import express from "express";
import { createCategoryController, getAllCategoriesController, getProductsByCategoryController } from "../../controllers/admin/adminCategoryController.js"
import { isAdminLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router();

router.post("/", isAdminLoginIn, createCategoryController);
router.get("/", getAllCategoriesController);
router.get("/product-category", getProductsByCategoryController);

export default router;