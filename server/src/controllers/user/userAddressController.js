import { addAddressService, getAddressService, updateAddressService } from "../../services/user/userAddressService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js"; // assume winston logger setup hai

export const userAddAddressController = async (req, res) => {
    try {
        const { userId } = req.session.user;
        if (!userId) {
            logger.warn("Add address attempt without login");
            return errorResponse(res, 400, "Login required");
        }

        const result = await addAddressService(userId, req.body);
        logger.info(`User ${userId} added address: ${JSON.stringify(result)}`);
        return successResponse(res, 200, "Address added successfully", result);
    } catch (err) {
        logger.error(`Error in userAddAddressController: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const userGetAddressController = async (req, res) => {
    try {
        const { userId } = req.session.user;
        if (!userId) {
            logger.warn("Get address attempt without login");
            return errorResponse(res, 400, "Login required");
        }

        const address = await getAddressService(userId);
        logger.info(`User ${userId} fetched address`);
        return successResponse(res, 200, "Address fetched successfully", address);
    } catch (err) {
        logger.error(`Error in userGetAddressController: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const userChangeAddressController = async (req, res) => {
    try {
        const { userId } = req.session.user;
        if (!userId) {
            logger.warn("Change address attempt without login");
            return errorResponse(res, 400, "Login required");
        }

        const result = await updateAddressService(userId, req.body);
        logger.info(`User ${userId} updated address: ${JSON.stringify(result)}`);
        return successResponse(res, 200, "Address updated successfully", result);
    } catch (err) {
        logger.error(`Error in userChangeAddressController: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};