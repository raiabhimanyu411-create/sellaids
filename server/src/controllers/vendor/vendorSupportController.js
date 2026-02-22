import { raiseSupportTicket } from "../../services/vendor/vendorSupportService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { vendorTicketSchema } from "../../validations/supportValidation.js"
import logger from "../../config/logger.js";
import { sendEmail } from "../../utils/mailer.js";
import config from "../../config/config.js";

export const vendorCreateTicketController = async (req, res) => {
    try {
        // Validate request body
        await vendorTicketSchema.validate(req.body, { abortEarly: false });

        // ✅ Get vendor ID & email from session
        const sessionvendor = req.session.vendor;
        if (!sessionvendor) {
            return errorResponse(res, "Unauthorized: Please login first", 401);
        }

        const vendor_id = sessionvendor.vendorId;
        const vendor_email = sessionvendor.email;
        const vendor_name = sessionvendor.name;
        const { title, message } = req.body;

        const ticket = await raiseSupportTicket({ vendor_id, title, message, vendor_name, vendor_email });

        // Send confirmation email to vendor
        await sendEmail(
            vendor_email,
            "Support Ticket Received",
            `Hello ${vendor_name},
        
            Thank you for contacting MyShop Support.
        
            Your support request has been successfully submitted. Our team will review your ticket and get back to you as soon as possible.
        
            If you have any additional information to share, simply reply to this email.
        
            Regards,
            MyShop Support Team
            Email: contact@sellaids.com
            Phone: +91 8800425855`
        );
        logger.info(`Support ticket confirmation email sent to vendor: ${vendor_email}`);

        // Notify admin about new ticket
        await sendEmail(
            config.email.user,
            "New Support Ticket Raised",
            `Hello Admin,
        
            A new support ticket has been raised on MyShop.
        
            Vendor Name: ${vendor_name}
            Vendor Email: ${vendor_email}
        
            Please review the ticket and respond accordingly.
        
            Regards,
            MyShop System Notification`
        );

        logger.info(`Admin notified for new support ticket raised by vendor: ${vendor_email}`);

        return successResponse(res, 201, "Support ticket raised successfully", ticket);
    } catch (err) {
        logger.error(`createSupportTicket Error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};