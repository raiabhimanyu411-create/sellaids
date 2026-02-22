import express from "express"
import { userRegisterController, userLoginController, userLogoutController, userForgotPasswordController, userResetPasswordController } from "../../controllers/user/userAuthController.js"
// import { sessionMiddleware } from "../../config/session.js"

const router = express.Router()

// auth 
router.post("/register", userRegisterController)
router.post("/login", userLoginController)
// router.post("/logout", sessionMiddleware, logout)
router.post("/logout", userLogoutController)

// password
router.put("/forgot-password", userForgotPasswordController)
router.put("/reset-password", userResetPasswordController)

export default router