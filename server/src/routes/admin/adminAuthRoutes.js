import express from "express"
import { adminRegisterController, adminLoginController, adminLogoutController, checkAdminSession, adminForgotPasswordController, adminResetPasswordController } from "../../controllers/admin/adminAuthController.js"
// import { sessionMiddleware } from "../../config/session.js"

const router = express.Router()

// auth 
router.post("/register", adminRegisterController)
router.post("/login", adminLoginController)
// router.post("/logout", sessionMiddleware, logout)
router.post("/logout", adminLogoutController)

// password
router.put("/forgot-password", adminForgotPasswordController)
router.put("/reset-password", adminResetPasswordController)

router.get("/check-session", checkAdminSession);

export default router