import express from "express"
import vendorAuthRoutes from "./vendorAuthRoutes.js"
import vendorSupportRoutes from './vendorSupportRoutes.js'
import vendorRoutes from "./vendorRoutes.js"

const router = express.Router()

router.use("/auth", vendorAuthRoutes)
router.use("/support", vendorSupportRoutes)
router.use("/", vendorRoutes)

export default router