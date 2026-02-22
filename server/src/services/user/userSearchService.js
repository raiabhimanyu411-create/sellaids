import { Product } from "../../models/productModel.js";
import { Category } from "../../models/categoryModel.js";
import { Op, fn, col, where, literal } from "sequelize";

export const searchProductsService = async (query) => {
  const terms = query.toLowerCase().split(/\s+/); 
  const likeConditions = [];

  terms.forEach(term => {
    const searchTerm = `%${term}%`;

    likeConditions.push({
      [Op.or]: [
        where(fn("LOWER", col("product_group")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("product_type")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("brand")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("model_name")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("size")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("fit")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("product_condition")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("sku")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("product_color")), { [Op.like]: searchTerm }),

        // JSON FIELDS (WITH JSON_UNQUOTE)
        literal(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(additional_info, '$.fabric'))) LIKE '${searchTerm}'`),
        literal(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(additional_info, '$.model_size'))) LIKE '${searchTerm}'`),
        literal(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(additional_info, '$.description'))) LIKE '${searchTerm}'`),
        literal(`JSON_SEARCH(LOWER(JSON_UNQUOTE(category.group)), 'all', '%${term}%') IS NOT NULL`),

       
        where(fn("LOWER", col("additional_info")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("additional_items")), { [Op.like]: searchTerm }),

        // NUMERIC FIELDS (NO LOWER)
        where(col("selling_price"), { [Op.like]: `%${term}%` }),
        where(col("purchase_price"), { [Op.like]: `%${term}%` }),

        // CATEGORY FIELDS
        where(fn("LOWER", col("category.name")), { [Op.like]: searchTerm }),
        where(fn("LOWER", col("category.slug")), { [Op.like]: searchTerm }),
      ]
    });
  });

  try {
    return await Product.findAll({
      where: {
        is_active: true,
        status: "approved",
        [Op.and]: likeConditions,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["category_id", "DESC"]],
      limit: 5000,
    });

  } catch (error) {
    console.log("SEARCH ERROR:", error);
    throw new Error(error.message || "Database error during search");
  }
};