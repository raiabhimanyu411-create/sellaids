import { Category } from "../../models/categoryModel.js";
import { Product } from "../../models/productModel.js";
import logger from "../../config/logger.js";
import { Op } from "sequelize";

// Create Category
export const createCategoryService = async ({ name, parent_id = null, adminId }) => {
    try {
        let level = 1;

        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) throw new Error("Parent category not found");
            level = parentCategory.level + 1;
        }

        const category = await Category.create({ name, parent_id, level, adminId });

        logger.info(`Category created: ${name}`);
        return category;
    } catch (error) {
        logger.error("Error creating category:", error);
        throw error;
    }
};

// 🟢 Recursive helper function for nested structure
const buildCategoryTree = (categories, parentId = null) => {
    return categories
        .filter((cat) => cat.parent_id === parentId)
        .map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            level: cat.level,
            subCategories: buildCategoryTree(categories, cat.id),
        }));
};

// 🟢 Get all categories
export const getAllCategoriesService = async (path) => {
    try {
        const categories = await Category.findAll({ raw: true });
        // logger.info(JSON.stringify(categories, null, 2));

        // 🟢 agar path nahi diya gaya (means show all)
        if (!path) {
            const tree = buildCategoryTree(categories);
            logger.info("Fetched all categories");
            return tree;
        }

        const slugs = path.split("/").map((slug) => slug.toLowerCase());

        let parent = null;
        let foundCategory = null;

        // each slug ke liye parent-child verify karo
        for (const slug of slugs) {
            foundCategory = categories.find(
                (cat) =>
                    cat.slug?.toLowerCase() === slug &&
                    (parent ? cat.parent_id === parent.id : cat.parent_id === null)
            );

            if (!foundCategory) {
                logger.warn(`Category not found for slug: ${slug}`);
                return [];
            }

            parent = foundCategory;
        }

        const subTree = buildCategoryTree(categories, foundCategory.id);
        const result = [
            {
                id: foundCategory.id,
                name: foundCategory.name,
                slug: foundCategory.slug,
                level: foundCategory.level,
                subCategories: subTree,
            },
        ];

        logger.info(`Fetched nested category tree for path: ${path}`);
        return result;
    } catch (error) {
        logger.error("Error fetching categories:", error);
        throw error;
    }
};


// Recursive function to find all child category IDs
const getAllSubCategoryIds = (categories, parentId) => {
    // defensive: if no categories or invalid parentId
    if (!Array.isArray(categories) || parentId == null) return [];

    const ids = [];
    const map = new Map();
    for (const c of categories) {
        map.set(c.id, c);
    }

    // build adjacency list
    const childrenMap = new Map();
    for (const c of categories) {
        const pid = c.parent_id ?? null;
        if (!childrenMap.has(pid)) childrenMap.set(pid, []);
        childrenMap.get(pid).push(c.id);
    }

    // iterative DFS to avoid deep recursion issues
    const stack = [parentId];
    while (stack.length) {
        const cur = stack.pop();
        if (!ids.includes(cur)) ids.push(cur);
        const kids = childrenMap.get(cur) || [];
        for (const kid of kids) {
            if (!ids.includes(kid)) stack.push(kid);
        }
    }

    return ids;
};

export const getProductsByCategoryService = async (path, options = {}) => {
    try {
        logger.info(`Service: fetching products for path="${path}" options=${JSON.stringify(options)}`);

        // fetch all categories once
        const categories = await Category.findAll({ raw: true });

        if (!path) {
            logger.warn("Service: path not provided");
            return { category: null, totalProducts: 0, filters: {}, products: [] };
        }

        const slugs = path.split("/").map((s) => s.trim().toLowerCase()).filter(Boolean);
        if (!slugs.length) {
            logger.warn("Service: path empty after split");
            return { category: null, totalProducts: 0, filters: {}, products: [] };
        }

        // find the category matching nested slugs
        let parent = null;
        let foundCategory = null;
        for (const slug of slugs) {
            foundCategory = categories.find(
                (cat) =>
                    cat.slug?.toLowerCase() === slug &&
                    (parent ? cat.parent_id === parent.id : (cat.parent_id === null || cat.parent_id === 0))
            );
            if (!foundCategory) {
                logger.warn(`Service: Category not found for slug="${slug}"`);
                return { category: null, totalProducts: 0, filters: {}, products: [] };
            }
            parent = foundCategory;
        }

        // get all nested category ids (including foundCategory)
        const allCategoryIds = getAllSubCategoryIds(categories, foundCategory.id);

        // build where clause with filters
        const where = {
            category_id: { [Op.in]: allCategoryIds },
            is_active: true,
            status: "approved",
        };

        // filter: product condition(s)
        if (options.condition) {
            // options.condition can be string or array
            const conds = Array.isArray(options.condition) ? options.condition : String(options.condition).split(",").map(s => s.trim()).filter(Boolean);
            if (conds.length) where.product_condition = { [Op.in]: conds };
        }

        // filter: sizes (match either size enum or size_other value)
        const sizeFilters = Array.isArray(options.sizes) ? options.sizes : (options.sizes ? String(options.sizes).split(",").map(s => s.trim()).filter(Boolean) : []);
        // We'll apply size filter after fetching because size_other is free-text (easier to filter in JS)
        const applySizeFilterInJS = sizeFilters.length > 0;

        // sort/order
        let order = [];
        const sort = String(options.sort || "").toLowerCase();
        if (sort === "low" || sort === "low-to-high") order = [["selling_price", "ASC"]];
        else if (sort === "high" || sort === "high-to-low") order = [["selling_price", "DESC"]];

        // DB fetch
        const productsRaw = await Product.findAll({
            where,
            order,
            attributes: [
                "id",
                "sku",
                "product_type",
                "product_group",
                "product_condition",
                "fit",
                "size",
                "size_other",
                "product_color",
                "brand",
                "selling_price",
                "purchase_price",
                "front_photo",
                "back_photo",
                "more_images",
                "additional_info",
                "model_name",
                "stock",
                "stock_status",
                "status",
                "created_at",
                "category_id",
            ],
            raw: true,
        });

        // Transform rows into frontend-friendly shape
        let products = productsRaw.map((p) => {
            // pick main image: front_photo -> first of more_images -> placeholder
            let product_img = p.front_photo || (Array.isArray(p.more_images) && p.more_images[0]) || null;
            if (!product_img && typeof p.more_images === "string") {
                try {
                    const parsed = JSON.parse(p.more_images);
                    if (Array.isArray(parsed) && parsed.length) product_img = parsed[0];
                } catch (e) { /* ignore */ }
            }

            return {
                _id: p.id,
                sku: p.sku,
                product_name: p.additional_info,
                product_img: product_img,
                product_group: p.product_group,
                product_additionalInfo: p.additional_info || p.description || "",
                product_price: p.selling_price,
                product_condition: p.product_condition,
                size: p.size,
                size_other: p.size_other,
                brand: p.brand,
                category_id: p.category_id,
                stock: p.stock,
                stock_status: p.stock_status,
            };
        });

        // apply size filter in JS when necessary (matches size enum OR size_other)
        if (applySizeFilterInJS) {
            products = products.filter((p) => {
                const sizeValue =
                    p.size?.toString().toLowerCase() === "other"
                        ? p.size_other?.toString().toLowerCase()
                        : p.size?.toString().toLowerCase();

                return sizeFilters.some(
                    (req) => req.toLowerCase() === (sizeValue || "").toLowerCase()
                );
            });
        }

        // build filters to return (unique conditions & sizes from the result set)
        // const productConditions = Array.from(new Set(products.map(p => p.product_condition).filter(Boolean)));
        const productConditions = Array.from(
            new Set(products.map((p) => p.product_condition).filter(Boolean))
        );
        // const sizes = Array.from(new Set(products.map(p => (p.size === "Other" && p.size_other) ? p.size_other : p.size).filter(Boolean)));

        const sizeSet = new Set();

        for (const p of products) {
            if (p.size?.toLowerCase() === "other" && p.size_other) {
                const parts = p.size_other.split(",").map(s => s.trim()).filter(Boolean);
                parts.forEach(val => sizeSet.add(val));
            } else if (p.size) {
                sizeSet.add(p.size);
            }
        }

        const sizes = Array.from(sizeSet);

        logger.info(`Service: returning ${products.length} products for category id=${foundCategory.id}`);

        return {
            category: {
                id: foundCategory.id,
                name: foundCategory.name,
                slug: foundCategory.slug,
            },
            totalProducts: products.length,
            filters: {
                product_conditions: productConditions,
                sizes,
            },
            products,
        };

    } catch (error) {
        logger.error("Error in getProductsByCategoryService:", error);
        throw error;
    }
};
