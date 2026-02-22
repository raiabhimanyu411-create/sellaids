import * as yup from "yup";

export const userAddressSchema = yup.object({
    address_line: yup
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(255, "Address must not exceed 255 characters")
        .required("Address line is required"),
    city: yup
        .string()
        .trim()
        .matches(/^[a-zA-Z\s]+$/, "City must contain only letters")
        .min(2, "City must be at least 2 characters")
        .max(100, "City must not exceed 100 characters")
        .required("City is required"),
    state: yup
        .string()
        .trim()
        .matches(/^[a-zA-Z\s]+$/, "State must contain only letters")
        .min(2, "State must be at least 2 characters")
        .max(100, "State must not exceed 100 characters")
        .required("State is required"),
    pincode: yup
        .string()
        .trim()
        .matches(/^[0-9]{4,10}$/, "Pincode must be valid") // allows 4-10 digits, suitable for international
        .required("Pincode is required")
});