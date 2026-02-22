import * as yup from "yup";

export const createCategorySchema = yup.object({
    name: yup
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters")
        .max(100, "Category name cannot exceed 100 characters")
        .required("Category name is required"),

    parent_id: yup
        .number()
        .nullable()
        .typeError("Parent ID must be a number or null"),
});