import express from "express"
import { vendorRegisterController, vendorLoginController, vendorLogoutController, vendorForgotPasswordController, vendorResetPasswordController } from "../../controllers/vendor/vendorAuthController.js"
// import { sessionMiddleware } from "../../config/session.js"

const router = express.Router()

// auth 
router.post("/register", vendorRegisterController)
router.post("/login", vendorLoginController)
// router.post("/logout", sessionMiddleware, logout)
router.post("/logout", vendorLogoutController)

// password
router.put("/forgot-password", vendorForgotPasswordController)
router.put("/reset-password", vendorResetPasswordController)

export default router