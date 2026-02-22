import { UserSupport } from "../../models/userSupportModel.js";
import { sendEmail, generateEmailTemplate } from "../../utils/mailer.js";
import config from "../../config/config.js";
import logger from "../../config/logger.js";

export const raiseSupportTicket = async ({ user_id, title, message, user_name, user_email }) => {
  try {
    // Save to DB
    const ticket = await UserSupport.create({ user_id, title, message });
    logger.info(`Support ticket #${ticket.id} created by user ${user_id}`, { ticket });

    // User Confirmation Email
    const userEmailSubject = `Ticket #${ticket.id} Received: ${title}`;
    const userEmailText = `Hello ${user_name},\n\nWe have received your support ticket:\n\nTitle: ${title}\nMessage: ${message}\n\nOur team will get back to you soon.\n\nThank you!`;
    const userEmailHtml = generateEmailTemplate(
      "Support Ticket Received",
      `
        <p>Hello ${user_name},</p>
        <p>Thank you for reaching out to us. We have successfully received your support ticket:</p>
        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Our support team will review your request and get back to you as soon as possible.</p>
        <p><a href="${config.frontend.url}/user/support" class="button">View Support</a></p>
      `,
      "Thank you for choosing MyShop! If you have further questions, feel free to reach out."
    );

    // Admin Notification Email
    const adminEmailSubject = `New Support Ticket #${ticket.id}: ${title}`;
    const adminEmailText = `A new support ticket has been raised:\n\nTicket ID: ${ticket.id}\nUser: ${user_name} (${user_email})\nTitle: ${title}\nMessage: ${message}`;
    const adminEmailHtml = generateEmailTemplate(
      "New Support Ticket Raised",
      `
        <p>Hello Admin,</p>
        <p>A new support ticket has been raised by a user:</p>
        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
        <p><strong>User:</strong> ${user_name} (${user_email})</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Please review the ticket and take appropriate action.</p>
      `,
      "MyShop Support System"
    );

    // Send emails concurrently
    await Promise.all([
      sendEmail(user_email, userEmailSubject, userEmailText, userEmailHtml),
      sendEmail(config.email.adminEmail, adminEmailSubject, adminEmailText, adminEmailHtml),
    ]);
    logger.info(`Emails sent for ticket #${ticket.id} to ${user_email} and admin`);

    return ticket;
  } catch (err) {
    logger.error(`raiseSupportTicket Error: ${err.message}`, { error: err });
    throw err;
  }
};

export const getAllTicketsByUser = async (user_id) => {
  return await UserSupport.findAll({
    where: { user_id },
    order: [["created_at", "DESC"]],
  });
};