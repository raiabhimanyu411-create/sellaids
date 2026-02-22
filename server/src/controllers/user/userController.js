import { getUserById, updateProfile } from "../../services/user/userService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { updateUserProfile } from "../../validations/updateProfileValidation.js";
import logger from "../../config/logger.js"

export const userGetProfile = async (req, res) => {
    const userId = req.session?.user?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "User not logged in or session expired" });
    }
    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        logger.info(`User profile fetched: ${userId}`);
        return res.status(200).json({ success: true, message: "User profile retrieved", data: user });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
};

export const userUpdateProfile = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
  }
  try {
    await updateUserProfile.validate(req.body, { abortEarly: false });
    const { name, phone, address_line, city, state, pincode, currentPassword, newPassword } = req.body;
    await updateProfile(userId, name, phone, address_line, city, state, pincode, currentPassword, newPassword);
    logger.info(`Profile updated for user ${userId}`);
    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    logger.error(error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};