import { createCategoryService, getAllCategoriesService, getProductsByCategoryService } from "../../services/admin/adminCategoryService.js";
import { createCategorySchema } from "../../validations/categoryValidation.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

export const createCategoryController = async (req, res) => {
    try {
        const adminId = req?.session?.admin?.adminId;
        const validatedData = await createCategorySchema.validate(req.body, {
            abortEarly: false,
        })
        const { name, parent_id } = validatedData;

        const category = await createCategoryService({ adminId, name, parent_id });
        logger.info(`Category created: ${category.name} by Admin ${adminId}`);

        return successResponse(res, 201, "Category created successfully", category);
    } catch (err) {
        logger.error(`Category creation error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const getAllCategoriesController = async (req, res) => {
    try {
        const { path } = req.query;
        console.log(path)
        const data = await getAllCategoriesService(path);
        return successResponse(res, 200, "All categories fetched", data);
    } catch (err) {
        return errorResponse(res, 500, err);
    }
};

// export const getProductsByCategoryController = async (req, res) => {
//     try {
//         const { path, sort } = req.query; // ?path=men/clothing&sort=low-to-high

//         if (!path) {
//             return res.json({
//                 success: false,
//                 message: `path is required`
//             })
//         }

//         const data = await getProductsByCategoryService(path, sort);
//         return successResponse(res, 200, "Products fetched successfully", data);
//     } catch (error) {
//         return errorResponse(res, 500, error);
//     }
// };

export const getProductsByCategoryController = async (req, res) => {
    try {
        // Query params:
        // path (required) e.g. men/clothing/shirts
        // sort (optional): default | low | high
        // condition (optional): new or new,used
        // sizes (optional): M,L or M or size_other values comma separated
        const { path, sort, condition, sizes } = req.query;

        if (!path) {
            return res.status(400).json({
                success:false, 
                message:"path is required"
            })
        }

        // normalize filters into arrays where useful
        const options = {
            sort,
        };
        if (condition) {
            options.condition = Array.isArray(condition) ? condition : String(condition).split(",").map(s => s.trim()).filter(Boolean);
        }
        if (sizes) {
            options.sizes = Array.isArray(sizes) ? sizes : String(sizes).split(",").map(s => s.trim()).filter(Boolean);
        }

        logger.info(`Controller: request for path="${path}" opts=${JSON.stringify(options)}`);

        const data = await getProductsByCategoryService(path, options);
        return successResponse(res, 200, "Products fetched successfully", data);
    } catch (error) {
        logger.error("Controller error in getProductsByCategoryController:", error);
        return errorResponse(res, 500, error);
    }
};