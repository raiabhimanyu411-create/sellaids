import * as yup from "yup";

export const contactSchema = yup.object({
    name: yup.string().trim().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    phone: yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone is required"),
    message: yup.string().trim().max(1000, "Message too long").optional(),
});