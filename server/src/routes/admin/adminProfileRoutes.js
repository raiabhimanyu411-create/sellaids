import express from "express";
import { getAdminProfileController, updateAdminProfileController } from "../../controllers/admin/adminProfileController.js"
import { isAdminLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router();

router.get("/", isAdminLoginIn, getAdminProfileController);
router.put("/", isAdminLoginIn, updateAdminProfileController);

export default router;