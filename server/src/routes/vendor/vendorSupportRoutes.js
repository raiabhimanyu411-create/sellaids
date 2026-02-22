import express from "express"
import { vendorCreateTicketController } from "../../controllers/vendor/vendorSupportController.js"
import { isVendorLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

// ticket rased 
router.post("/", isVendorLoginIn, vendorCreateTicketController)

export default router