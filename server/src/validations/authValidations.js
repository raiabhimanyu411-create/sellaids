import * as yup from "yup";

/* ------------------------ USER REGISTER ------------------------ */
export const userRegisterSchema = yup.object({
    name: yup.string().min(2, "Name must be at least 2 characters").max(100).required("Name is required"),

    email: yup.string().email("Invalid email").max(150).required("Email is required"),

    phone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Phone must be valid").required("Phone number is required"),

    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain uppercase")
        .matches(/[a-z]/, "Must contain lowercase")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[@$!%*?&]/, "Must contain special character")
        .required("Password is required"),

    address_line: yup.string().max(255).optional(),
    city: yup.string().max(100).optional(),
    state: yup.string().max(100).optional(),
    pincode: yup.string().matches(/^\d{5,10}$/, "Invalid pincode").optional(),

    reset_token: yup.string().nullable().max(255).optional(),
    reset_token_expires: yup.date().nullable().optional().typeError("Invalid expiry date"),
});

/* ------------------------ VENDOR REGISTER ------------------------ */
export const vendorRegisterSchema = yup.object({
    name: yup.string().trim().min(2).max(100).required("Vendor name is required"),

    phone: yup
        .string()
        .matches(/^[6-9]\d{9}$/, "Invalid phone number")
        .required("Phone number is required"),

    email: yup.string().email("Invalid email format").max(100).required("Email is required"),

    password: yup
        .string()
        .min(8)
        .matches(/[A-Z]/, "Must contain uppercase letter")
        .matches(/[a-z]/, "Must contain lowercase letter")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[@$!%*?&]/, "Must contain special character")
        .required("Password is required"),

    business_name: yup.string().max(150).required("Business name is required"),

    business_type: yup.string().oneOf(["restaurant", "grocery", "fashion", "electronics", "other"]).default("other"),

    gst_number: yup.string().matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3})$/, "Invalid GST number").nullable().optional(),

    pan_number: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number").nullable().optional(),

    account_number: yup.string().matches(/^[0-9]{9,18}$/, "Invalid account number").nullable().optional(),

    ifsc_code: yup.string().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code").nullable().optional(),

    bank_name: yup.string().max(100).nullable(),
    account_type: yup.string().oneOf(["savings", "current"]).default("savings"),

    state: yup.string().max(100).nullable(),
    city: yup.string().max(100).nullable(),
    pincode: yup.string().nullable(),

    contact_person_name: yup.string().max(100).nullable(),
    contact_person_phone: yup.string().nullable(),

    status: yup.string().oneOf(["pending", "approved", "rejected"]).default("pending"),

    reset_token: yup.string().nullable().max(255).optional(),
    reset_token_expires: yup.date().nullable().optional().typeError("Invalid expiry date"),
});

/* ------------------------ ADMIN REGISTER ------------------------ */
export const adminRegisterSchema = yup.object({
    name: yup.string().trim().min(2).max(100).required("Name is required"),

    phone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Phone must be 10-15 digits").required("Phone number is required"),

    email: yup.string().email("Invalid email format").max(100).required("Email is required"),

    password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&]/, "Password must contain at least one special character")
        .required("Password is required"),

    reset_token: yup.string().nullable().max(255).optional(),
    reset_token_expires: yup.date().nullable().optional().typeError("Invalid expiry date"),
});

/* ------------------------ LOGIN (FIXED) ------------------------ */
export const loginSchema = yup.object({
    email: yup.string().email("Invalid email format").max(150).required("Email is required"),

    // LOGIN SHOULD NOT HAVE ANY PASSWORD RULES
    password: yup.string().required("Password is required"),
});
