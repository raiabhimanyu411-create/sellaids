import { registerUser, loginUser, forgotPasswordService, resetPasswordService } from "../../services/user/userAuthService.js"
import { successResponse, errorResponse } from "../../utils/helpers.js"
import { userRegisterSchema, loginSchema } from "../../validations/authValidations.js"
import { sendEmail } from "../../utils/mailer.js"
import logger from "../../config/logger.js"
import config from "../../config/config.js"

export const userRegisterController = async (req, res) => {
    try {
        const validatedData = await userRegisterSchema.validate(req.body, { abortEarly: false });

        const newUser = await registerUser(validatedData);

        logger.info(`User registered: ${newUser.email}`);
        return successResponse(res, 201, `${newUser.name} registered successfully`, { id: newUser.id, name: newUser.name, email: newUser.email });
    } catch (err) {
        logger.error(`Register error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};


export const userLoginController = async (req, res) => {
    try {
        const validatedData = await loginSchema.validate(req.body, { abortEarly: false });

        const user = await loginUser(validatedData);

        req.session.user = { userId: user.id, email: user.email, name: user.name }; // Add name here
        req.session.cookie.maxAge = 30 * 60 * 1000; // 30 min 
        console.log(req.session.user);

        logger.info(`User logged in: ${user.email} (Name: ${user.name})`);
        return successResponse(res, 200, `${user.name} login successfully`, { id: user.id, name: user.name, email: user.email });
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const userLogoutController = (req, res) => {
    try {
        const email = req.session?.user?.email;
        req.session.destroy((err) => {
            if (err) {
                logger.error(`Logout error: ${err.message}`);
                return errorResponse(res, 400, err);
            }
            res.clearCookie("session_cookie_name", { path: "/" })
            logger.info(`User logged out: ${email}`);
            return successResponse(res, 200, "Logout successfully");
        });
    } catch (err) {
        logger.error(`Logout exception: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const userForgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            logger.warn("Forgot password attempt without email");
            return errorResponse(res, 400, "Email is required");
        }

        // Generate reset token
        const token = await forgotPasswordService(email);
        const resetLink = `${config.frontend.url}/UserAuth/reset-password/${token}`;

        // Send email
        await sendEmail(email, "Reset Your Password", `Click here to reset your password: ${resetLink}`);
        logger.info(`Reset password link sent to ${email}`);

        return successResponse(res, 200, "Reset link sent successfully", { resetLink });
    } catch (err) {
        logger.error(`Forgot password error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const userResetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            logger.warn("Reset password attempt with missing token or password");
            return errorResponse(res, 400, "Token and new password required");
        }

        // Reset password in DB
        const user = await resetPasswordService(token, newPassword);

        // Send confirmation email
        await sendEmail(
            user.email,
            "Password Reset Successful",
            `Hello ${user.name || "User"}, your password has been reset successfully.`
        );
        logger.info(`Password reset successful for user: ${user.email}`);

        return successResponse(res, 200, "Password reset successfully");
    } catch (err) {
        logger.error(`Reset password error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};