import { raiseSupportTicket, getAllTicketsByUser } from "../../services/user/userSupportService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { supportTicketSchema } from "../../validations/supportValidation.js";
import logger from "../../config/logger.js";
import config from "../../config/config.js"
import { sendEmail } from "../../utils/mailer.js";

export const userCreateTicketController = async (req, res) => {
  try {
    // Validate request body
    await supportTicketSchema.validate(req.body, { abortEarly: false });

    // Get user ID, email, and name from session
    const sessionUser = req.session.user;
    logger.info("Session user data:", JSON.stringify(sessionUser, null, 2)); // Enhanced logging
    if (!sessionUser) {
      return errorResponse(res, "Unauthorized: Please login first", 401);
    }

    const user_id = sessionUser.userId;
    const user_email = sessionUser.email;
    const user_name = sessionUser.name;
    const { title, message } = req.body;

    const ticket = await raiseSupportTicket({ user_id, title, message, user_name, user_email });
    logger.info("Ticket created:", JSON.stringify(ticket, null, 2)); // Log ticket details

    // Send confirmation email to user
    await sendEmail(
      user_email,
      "Support Ticket Received",
      `Hello ${user_name},

    Thank you for contacting MyShop Support.

    Your support request has been successfully submitted. Our team will review your ticket and get back to you as soon as possible.

    If you have any additional information to share, simply reply to this email.

    Regards,
    MyShop Support Team
    Email: contact@sellaids.com
    Phone: +91 8800425855`
    );
    logger.info(`Support ticket confirmation email sent to user: ${user_email}`);

    // Notify admin about new ticket
    await sendEmail(
      config.email.user,
      "New Support Ticket Raised",
      `Hello Admin,

    A new support ticket has been raised on MyShop.

    User Name: ${user_name}
    User Email: ${user_email}

    Please review the ticket and respond accordingly.

    Regards,
    MyShop System Notification`
  );

  logger.info(`Admin notified for new support ticket raised by user: ${user_email}`);


    return successResponse(res, 201, "Support ticket raised successfully", { ticket });
  } catch (err) {
    logger.error(`createSupportTicket Error: ${err.message}`, { error: err });
    if (err.name === "ValidationError") {
      const errors = err.errors || ["Validation failed"];
      return res.status(400).json({ success: false, error: errors, message: "Validation failed" });
    }
    return errorResponse(res, 500, err.message || "Internal server error");
  }
};

export const userGetAllTicketsController = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const tickets = await getAllTicketsByUser(userId);

    return successResponse(res, 200, "Tickets fetched successfully", { tickets });
  } catch (err) {
    logger.error(err);
    return errorResponse(res, 500, err.message);
  }
};