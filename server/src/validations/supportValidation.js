import * as Yup from "yup";

// Support Ticket Validation
export const supportTicketSchema = Yup.object().shape({
    title: Yup
        .string()
        .max(200, "Title too long")
        .required("Title is required"),
    message: Yup
        .string()
        .required("Message is required"),
});

// Vendor Ticket Validation
export const vendorTicketSchema = Yup.object().shape({
    title: Yup
        .string()
        .max(200, "Title too long")
        .required("Title is required"),
    message: Yup
        .string()
        .required("Message is required"),
});
