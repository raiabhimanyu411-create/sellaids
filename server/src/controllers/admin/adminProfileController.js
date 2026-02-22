import { getAdminProfileService, updateAdminProfileService } from "../../services/admin/adminProfileService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

export const getAdminProfileController = async (req, res) => {
  try {
    const { adminId } = req.session.admin; // Assuming auth middleware sets req.user
    const adminProfile = await getAdminProfileService(adminId);

    return successResponse(res, 200, "Admin profile fetched successfully", adminProfile);
  } catch (error) {
    logger.error("Failed to get admin profile:", error);
    return errorResponse(res, 500, error);
  }
};

export const updateAdminProfileController = async (req, res) => {
  try {
    const { adminId } = req.session.admin; // Assuming authentication middleware sets req.user
    const { name, phone, password } = req.body;

    const updatedAdmin = await updateAdminProfileService(adminId, { name, phone, password });

    return successResponse(res, 200, "Admin profile updated successfully", updatedAdmin);
  } catch (error) {
    logger.error("Admin profile update failed:", error);
    return errorResponse(res, 500, error);
  }
};