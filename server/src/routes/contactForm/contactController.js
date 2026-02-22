// import { contactSchema } from "../../validations/contactValidation.js";
// import { createContact } from "../contactForm/contactService.js";

// export const submitContactForm = async (req, res) => {
//     try {
//         // Validate input
//         const validatedData = await contactSchema.validate(req.body, { abortEarly: false });

//         // Save to DB using service layer
//         const newContact = await createContact(validatedData);

//         return res.status(200).json({
//             success: true,
//             message: "Thank you for contacting us! We'll get back to you soon.",
//             data: newContact,
//         });
//     } catch (err) {
//         if (err.name === "ValidationError") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed",
//                 errors: err.errors,
//             });
//         }

//         console.error("❌ Contact form error:", err.message);
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong. Please try again later.",
//         });
//     }
// };


import config from "../../config/config.js";
import { contactSchema } from "../../validations/contactValidation.js";
import { createContact } from "../contactForm/contactService.js";
import { sendEmail } from "../../utils/mailer.js";
import logger from "../../config/logger.js";

export const submitContactForm = async (req, res) => {
    try {
        // Validate input
        const validatedData = await contactSchema.validate(req.body, { abortEarly: false });

        const { name, email, phone, message } = validatedData;

        // Save to DB using service layer
        const newContact = await createContact(validatedData);

        // Send confirmation email to User
        await sendEmail(
            email,
            "We Have Received Your Message – MyShop Support",
            `Hello ${name},

            Thank you for reaching out to MyShop Support.
            We have successfully received your message and our support team will get back to you shortly.
            Here is a copy of your message:
            ${message}

            If you have additional details to share, simply reply to this email.

            Warm regards,  
            MyShop Support Team  
            Email: contact@sellaids.com  
            Phone: +91 8800425855`
        );

        logger.info(`📩 Confirmation email sent to user: ${email}`);

        //  Notify Admin
        await sendEmail(
            config.email.user,
            "New Contact Form Submission – MyShop",
            `Hello Admin,

            A new contact inquiry has been submitted on MyShop.

            Details:
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Message: ${message}

            Please review and respond to the user as needed.

            Regards,
            MyShop System Notification`
        );

        logger.info(`📩 Admin notified about new contact form submission by: ${email}`);

        return res.status(200).json({
            success: true,
            message: "Thank you for contacting us! We'll get back to you soon.",
            data: newContact,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: err.errors,
            });
        }

        console.error("❌ Contact form error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};