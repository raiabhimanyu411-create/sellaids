import { registerAdmin, loginAdmin, forgotPasswordService, resetPasswordService } from "../../services/admin/adminAuthService.js"
import { successResponse, errorResponse } from "../../utils/helpers.js"
import { adminRegisterSchema, loginSchema } from "../../validations/authValidations.js"
import { sendEmail } from "../../utils/mailer.js"
import logger from "../../config/logger.js"
import config from "../../config/config.js"

export const adminRegisterController = async (req, res) => {
    try {
        const validatedData = await adminRegisterSchema.validate(req.body, { abortEarly: false });

        const newAdmin = await registerAdmin(validatedData);

        logger.info(`Admin registered: ${newAdmin.email}`);
        return successResponse(res, 201, `${newAdmin.name} registered successfully`, { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email });
    } catch (err) {
        logger.error(`Register error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};


export const adminLoginController = async (req, res) => {
    try {
        const validatedData = await loginSchema.validate(req.body, { abortEarly: false });

        const admin = await loginAdmin(validatedData);

        req.session.admin = { adminId: admin.id, email: admin.email };
        req.session.cookie.maxAge = 30 * 60 * 1000; // 30 min 
        console.log(req.session)
        console.log(req.session.admin.adminId)
        req.session.save((err) => {
            if (err) console.error("Session save error:", err);
        });

        logger.info(`Admin logged in: ${admin.email}`);
        return successResponse(res, 200, `${admin.name} login successfully`, { id: admin.id, name: admin.name, email: admin.email });
    } catch (err) {
        console.log("line 45:",err)
        console.error("line 46:",err)
        logger.error(`Login error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const adminLogoutController = (req, res) => {
    try {
        const email = req.session?.admin?.email;
        req.session.destroy((err) => {
            if (err) {
                logger.error(`Logout error: ${err.message}`);
                return errorResponse(res, 400, err);
            }
            res.clearCookie("session_cookie_name", { path: "/" })
            logger.info(`Admin logged out: ${email}`);
            return successResponse(res, 200, "Logout successfully");
        });
    } catch (err) {
        logger.error(`Logout exception: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const checkAdminSession = (req, res) => {
    try {
        if (req.session?.admin?.adminId) {
            return res.status(200).json({
                loggedIn: true,
                admin: req.session.admin,
            });
        } else {
            return res.status(200).json({
                loggedIn: false,
            });
        }
    } catch (error) {
        console.error("Error checking admin session:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const adminForgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            logger.warn("Forgot password attempt without email");
            return errorResponse(res, 400, "Email is required");
        }

        // Generate reset token
        const token = await forgotPasswordService(email);
        const resetLink = `${config.frontend.url}/admin/reset-password/${token}`;

        // Send email
        await sendEmail(email, "Reset Your Password", `Click here to reset your password: ${resetLink}`);
        logger.info(`Reset password link sent to ${email}`);

        return successResponse(res, 200, "Reset link sent successfully", { resetLink });
    } catch (err) {
        logger.error(`Forgot password error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const adminResetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            logger.warn("Reset password attempt with missing token or password");
            return errorResponse(res, 400, "Token and new password required");
        }

        // Reset password in DB
        const admin = await resetPasswordService(token, newPassword);

        // Send confirmation email
        await sendEmail(
            admin.email,
            "Password Reset Successful",
            `Hello ${admin.name || "Admin"}, your password has been reset successfully.`
        );
        logger.info(`Password reset successful for admin: ${admin.email}`);

        return successResponse(res, 200, "Password reset successfully");
    } catch (err) {
        logger.error(`Reset password error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};