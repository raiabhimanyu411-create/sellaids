import express from "express";
import {
    getVendorProfile,
    updateVendorPersonal,
    updateVendorBusiness,
    updateVendorBank,
    changeVendorPassword,
} from "../../controllers/vendor/vendorController.js";
import { isVendorLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router();

router.get("/profile", isVendorLoginIn, getVendorProfile);
router.put("/personal", isVendorLoginIn, updateVendorPersonal);
router.put("/business", isVendorLoginIn, updateVendorBusiness);
router.put("/bank", isVendorLoginIn, updateVendorBank);
router.put("/security", isVendorLoginIn, changeVendorPassword);

export default router;