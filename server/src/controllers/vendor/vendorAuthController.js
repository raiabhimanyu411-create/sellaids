import { registerVendor, loginVendor, forgotPasswordService, resetPasswordService } from "../../services/vendor/vendorAuthService.js"
import { successResponse, errorResponse } from "../../utils/helpers.js"
import { vendorRegisterSchema, loginSchema } from "../../validations/authValidations.js"
import { sendEmail } from "../../utils/mailer.js"
import logger from "../../config/logger.js"
import config from "../../config/config.js"

export const vendorRegisterController = async (req, res) => {
    try {
        const validatedData = await vendorRegisterSchema.validate(req.body, { abortEarly: false });

        const newVendor = await registerVendor(validatedData);

        logger.info(`Vendor registered: ${newVendor.email}`);
        return successResponse(res, 201, `${newVendor.name} registered successfully`, { id: newVendor.id, name: newVendor.name, email: newVendor.email });
    } catch (err) {
        logger.error(`Register error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};


export const vendorLoginController = async (req, res) => {
    try {
        const validatedData = await loginSchema.validate(req.body, { abortEarly: false });

        const vendor = await loginVendor(validatedData);

        req.session.vendor = { vendorId: vendor.id, email: vendor.email };
        req.session.cookie.maxAge = 30 * 60 * 1000; // 30 min 
        console.log(req.session.vendor.vendorId)

        logger.info(`Vendor logged in: ${vendor.email}`);
        return successResponse(res, 200, `${vendor.name} login successfully`, { id: vendor.id, name: vendor.name, email: vendor.email });
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const vendorLogoutController = (req, res) => {
    try {
        const email = req.session?.vendor?.email;
        req.session.destroy((err) => {
            if (err) {
                logger.error(`Logout error: ${err.message}`);
                return errorResponse(res, 400, err);
            }
            res.clearCookie("session_cookie_name", { path: "/" })
            logger.info(`Vendor logged out: ${email}`);
            return successResponse(res, 200, "Logout successfully");
        });
    } catch (err) {
        logger.error(`Logout exception: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const vendorForgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            logger.warn("Forgot password attempt without email");
            return errorResponse(res, 400, "Email is required");
        }

        // Generate reset token
        const token = await forgotPasswordService(email);
        const resetLink = `${config.frontend.url}/vendor/reset-password/${token}`;

        // Send email
        await sendEmail(email, "Reset Your Password", `Click here to reset your password: ${resetLink}`);
        logger.info(`Reset password link sent to ${email}`);

        return successResponse(res, 200, "Reset link sent successfully", { resetLink });
    } catch (err) {
        logger.error(`Forgot password error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const vendorResetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            logger.warn("Reset password attempt with missing token or password");
            return errorResponse(res, 400, "Token and new password required");
        }

        // Reset password in DB
        const vendor = await resetPasswordService(token, newPassword);

        // Send confirmation email
        await sendEmail(
            vendor.email,
            "Password Reset Successful",
            `Hello ${vendor.name || "Vendor"}, your password has been reset successfully.`
        );
        logger.info(`Password reset successful for vendor: ${vendor.email}`);

        return successResponse(res, 200, "Password reset successfully");
    } catch (err) {
        logger.error(`Reset password error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};