import express from "express"
import adminAuthRoutes from "./adminAuthRoutes.js"
import adminCategoryRoutes from "./adminCategoryRoutes.js"
import adminManagementRoutes from "./adminManagementRoutes.js"
import adminProfileRoutes from "./adminProfileRoutes.js"

const router = express.Router()

router.use("/auth", adminAuthRoutes)
router.use("/category", adminCategoryRoutes)
router.use("/profile", adminProfileRoutes)
router.use("/management", adminManagementRoutes)

export default router