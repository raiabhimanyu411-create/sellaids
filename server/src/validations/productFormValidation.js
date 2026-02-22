import * as yup from "yup";
import { Category } from "../models/categoryModel.js";
import { Product } from "../models/productModel.js";
import { Op } from "sequelize";

const categoryExists = async (category_id) => {
  if (!category_id) return true;
  const category = await Category.findByPk(category_id);
  return !!category;
};

export const productSchema = yup.object().shape({
  category_id: yup
    .number()
    .required("Category is required")
    .test("category-exists", "Category does not exist", categoryExists),
  product_group: yup.string().required("Product group is required"),
  product_type: yup.string().required("Product type is required"),
  product_condition: yup
    .string()
    .oneOf(["new", "almost_new", "good", "hardly_ever_used", "satisfactory"])
    .required(),
  fit: yup
    .string()
    .oneOf(["Slim", "Regular", "Loose", "Oversized", "Tailored", "Other"])
    .nullable(),
  size: yup
  .string()
  .oneOf([
    "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4xl", "5xl", "6xl",
    "Kids-Upto 3 Months", "Kids-Upto 6 Months", "Kids- 6-9 Months", "Kids- 9-12 Months",
    "Kids- 1-2 Years", "Kids- 3-4 Years", "Kids- 5-6 Years", "Kids- 7-8 Years",
    "Kids- 9-10 Years", "Kids- 10-12 Years", "Kids- 13-14 Years", "K 15-16 Years",
    "Kids- 17-18 Years", "Other"
  ])
  .required("Size is required"),

size_other: yup
  .string()
  .nullable()
  .when("size", {
    is: "Other",
    then: (schema) => schema.required("Custom size is required when size is Other"),
    otherwise: (schema) => schema.nullable().strip(), 
  }),
  product_color: yup.string().nullable(),
  brand: yup.string().required("Brand is required"),
  model_name: yup
    .string()
    .nullable(),
  invoice: yup.string().oneOf(["Yes", "No"]).required(),
  needs_repair: yup.string().oneOf(["Yes", "No"]).required(),
  original_box: yup.string().oneOf(["Yes", "No"]).required(),
  dust_bag: yup.string().oneOf(["Yes", "No"]).required(),
  purchase_price: yup.number().required("Purchase price is required"),
  selling_price: yup.number().required("Selling price is required"),
  reason_to_sell: yup.string().required("Reason to sell is required"),
  purchase_year: yup.number().required("Purchase year is required"),
  purchase_place: yup.string().required("Purchase place is required"),
  additional_items: yup.string().nullable(),
  product_link: yup.string().url().nullable(),
  additional_info: yup.string().nullable(),
});

const uniqueBrandModelForUpdate = async function (model_name, brand, currentProductId, vendorId) {
  if (!model_name || !brand || !vendorId) return true;

  const where = {
    vendor_id: vendorId,
    brand: brand.trim(),
    model_name: model_name.trim(),
    is_active: true,
    id: { [Op.ne]: currentProductId },
  };

  const existing = await Product.findOne({ where });
  return !existing;
};

export const updateProductSchema = yup.object().shape({
  // All fields are OPTIONAL for partial update
  category_id: yup
    .number()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test("category-exists", "Selected category does not exist", categoryExists),

  product_group: yup.string().trim().nullable(),
  product_type: yup.string().trim().nullable(),

  product_condition: yup
    .string()
    .oneOf(["new", "almost_new", "good", "hardly_ever_used", "satisfactory"], "Invalid condition")
    .nullable(),

  fit: yup
    .string()
    .oneOf(["Slim", "Regular", "Loose", "Oversized", "Tailored", "Other"])
    .nullable(),

  size: yup
    .string()
    .oneOf([
      "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4xl", "5xl", "6xl",
      "Kids-Upto 3 Months", "Kids-Upto 6 Months", "Kids- 6-9 Months", "Kids- 9-12 Months",
      "Kids- 1-2 Years", "Kids- 3-4 Years", "Kids- 5-6 Years", "Kids- 7-8 Years",
      "Kids- 9-10 Years", "Kids- 10-12 Years", "Kids- 13-14 Years", "K 15-16 Years",
      "Kids- 17-18 Years", "Other", null
    ])
    .nullable(),

  size_other: yup
    .string()
    .trim()
    .nullable()
    .when("size", {
      is: "Other",
      then: (schema) => schema.required("Custom size is required when size is 'Other'"),
      otherwise: (schema) => schema.nullable().strip(),
    }),

  product_color: yup.string().trim().nullable(),
  brand: yup.string().trim().nullable(),

  model_name: yup
    .string()
    .trim()
    .nullable(),

  invoice: yup.string().oneOf(["Yes", "No", null]).nullable(),
  needs_repair: yup.string().oneOf(["Yes", "No", null]).nullable(),
  original_box: yup.string().oneOf(["Yes", "No", null]).nullable(),
  dust_bag: yup.string().oneOf(["Yes", "No", null]).nullable(),

  purchase_price: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive("Purchase price must be positive"),

  selling_price: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive("Selling price must be positive"),

  purchase_year: yup
    .number()
    .nullable()
    .min(1900)
    .max(new Date().getFullYear() + 1),

  reason_to_sell: yup.string().trim().nullable(),
  purchase_place: yup.string().trim().nullable(),
  additional_items: yup.string().trim().nullable(),
  product_link: yup.string().url("Must be a valid URL").nullable(),
  additional_info: yup.string().trim().nullable(),
});