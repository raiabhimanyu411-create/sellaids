import {
    getVendorById,
    updatePersonalInfo,
    updateBusinessInfo,
    updateBankInfo,
    updatePassword,
} from "../../services/vendor/vendorService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { personalInfoSchema, businessInfoSchema, bankInfoSchema, passwordSchema } from "../../validations/updateProfileValidation.js";
import logger from "../../config/logger.js"

export const getVendorProfile = async (req, res) => {
    try {
        const { vendorId } = req?.session?.vendor;
        console.log("vendorId", vendorId)
        if (!vendorId) return errorResponse(res, 401, "Vendor not logged in");

        const vendor = await getVendorById(vendorId);
        if (!vendor) return errorResponse(res, 404, "Vendor not found");

        logger.info(`Vendor profile fetched: ${vendorId}`);
        return successResponse(res, 200, "Vendor profile retrieved", vendor);
    } catch (error) {
        logger.error(error.message);
        return errorResponse(res, 500, error);
    }
};

export const updateVendorPersonal = async (req, res) => {
    try {
        const { vendorId } = req?.session?.vendor;
        if (!vendorId)
            return errorResponse(res, 401, "Vendor not logged in");

        await personalInfoSchema.validate(req.body);
        const updatedVendor = await updatePersonalInfo(vendorId, req.body);

        logger.info(`Personal info updated for vendor ${vendorId}`);
        return successResponse(res, 200, "Personal info updated successfully", updatedVendor);
    } catch (error) {
        logger.error(error.message);
        return errorResponse(res, 500, error);
    }
};

export const updateVendorBusiness = async (req, res) => {
    try {
        const { vendorId } = req?.session?.vendor;
        if (!vendorId)
            return errorResponse(res, 401, "Vendor not logged in");

        await businessInfoSchema.validate(req.body);
        const updatedVendor = await updateBusinessInfo(vendorId, req.body);

        logger.info(`Business info updated for vendor ${vendorId}`);
        return successResponse(res, 200, "Business info updated successfully", updatedVendor);
    } catch (error) {
        logger.error(error.message);
        return errorResponse(res, 500, error);
    }
};

export const updateVendorBank = async (req, res) => {
    try {
        const { vendorId } = req?.session?.vendor;

        // Validate request body
        await bankInfoSchema.validate(req.body);  // account_number , ifcs_code, bank_number, account_type

        // Update only provided fields
        const updatedVendor = await updateBankInfo(vendorId, req.body);

        logger.info(`Bank info updated for vendor ${vendorId}`);

        return successResponse(res, 200, "Bank info updated successfully", updatedVendor);
    } catch (error) {
        logger.error(error.message);
        return errorResponse(res, 500, error);
    }
};

export const changeVendorPassword = async (req, res) => {
    try {
        const { vendorId } = req?.session?.vendor || {};

        if (!vendorId) {
            return errorResponse(res, 401, "Unauthorized: Vendor session missing");
        }

        // ✅ Validation will check all 3 fields: currentPassword, newPassword, confirmPassword
        await passwordSchema.validate(req.body, { abortEarly: false });

        const { currentPassword, newPassword } = req.body;

        // ✅ Only send what's needed to service
        await updatePassword(vendorId, currentPassword, newPassword);

        logger.info(`Password updated for vendor ${vendorId}`);
        return successResponse(res, 200, "Password updated successfully");
    } catch (error) {
        logger.error(error.message);
        return errorResponse(res, 500, error);
    }
};