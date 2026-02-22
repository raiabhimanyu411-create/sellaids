// utils/mailer.js
import nodemailer from "nodemailer";
import config from "../config/config.js";
import logger from "../config/logger.js";
import path from "path";

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: { rejectUnauthorized: false }
});

console.log("SMTP USER =", config.email.user);
console.log("SMTP PASS LENGTH =", config.email.pass ? config.email.pass.length : "NO PASS");


/**
 * Sends an email with the given parameters
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} [html] - HTML body (optional)
 */
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: `Sellaids Support <${config.email.user}>`,
      to,
      subject,
      text,
      html, // Include HTML if provided
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Error sending email to ${to}: ${err.message}`);
    throw err;
  }
};

/**
 * Generates a professional HTML email template
 * @param {string} header - Email header/title
 * @param {string} content - Main email content
 * @param {string} [footer] - Optional footer text
 * @returns {string} - HTML email template
 */
export const generateEmailTemplate = (header, content, footer = "Thank you for choosing Sellaids!") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #dc2626; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; background-color: white; border-radius: 0 0 5px 5px; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${header}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          ${footer}
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendInvoiceEmail = async (to, order, invoicePath) => {
  try {
    const html = generateEmailTemplate(
      "Your Order Invoice",
      `
        <p>Hello <b>${order.customerName}</b>,</p>
        <p>Thank you for your order. Please find your invoice attached.</p>
        <p><b>Order ID:</b> ORD-${order.id}</p>
        <p><b>Total Amount:</b> ₹${Number(order.subtotal) + 150}</p>
        <p>If you have any questions, feel free to contact us.</p>
      `
    );

    await transporter.sendMail({
      from: `Sellaids Support <${config.email.user}>`,
      to,
      subject: "Your Sellaids Invoice",
      text: `Hello ${order.customer_name}, your invoice is attached.`,
      html,
      attachments: [
        {
          filename: path.basename(invoicePath),
          path: invoicePath,
          contentType: "application/pdf",
        },
      ],
    });

    logger.info(`Invoice email sent to ${to}`);
  } catch (err) {
    logger.error(`Invoice email failed for ${to}: ${err.message}`);
    throw err;
  }
};