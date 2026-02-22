import { VendorSupport } from "../../models/vendorSupportModel.js";
import { sendEmail } from "../../utils/mailer.js";
import logger from "../../config/logger.js";

export const raiseSupportTicket = async ({ vendor_id, title, message, vendor_name, vendor_email }) => {
    try {
        // Save to DB
        const ticket = await VendorSupport.create({ vendor_id, title, message });
        logger.info(`Support ticket #${ticket.id} created by vendor ${vendor_id}`);

        const text = `Hello ${vendor_name},\n\nWe have received your ticket:\n\n${message}\n\nThank you!`
        // Send email notification
        await sendEmail(vendor_email, `Ticket Received: ${title}`, text)

        return ticket;
    } catch (err) {
        logger.error(`raiseSupportTicket Error: ${err.message}`);
        throw err;
    }
};