import * as Yup from "yup";

export const wishlistSchema = Yup.object().shape({
    product_id: Yup.string()
        .required("Product ID is required"),
});