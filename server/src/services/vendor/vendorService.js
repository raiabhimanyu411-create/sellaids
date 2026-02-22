import bcrypt from "bcryptjs";
import { Vendor } from "../../models/vendorModel.js";

export const getVendorById = async (vendorId) => {
    return await Vendor.findByPk(vendorId);
};

export const updatePersonalInfo = async (vendorId, data) => {
    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
        throw new Error("Vendor not found");
    }

    // Allowed fields
    const updatableFields = ["name", "phone", "password"];
    const fieldsToUpdate = {};

    updatableFields.forEach((field) => {
        if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
            fieldsToUpdate[field] = data[field];
        }
    });

    await vendor.update(fieldsToUpdate);

    return vendor;
};

export const updateBusinessInfo = async (vendorId, data) => {
    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
        throw new Error("Vendor not found");
    }

    // Allowed fields for business info
    const updatableFields = [
        "business_name",
        "business_type",
        "gst_number",
        "pan_number"
    ];

    const fieldsToUpdate = {};

    updatableFields.forEach((field) => {
        if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
            fieldsToUpdate[field] = data[field];
        }
    });

    await vendor.update(fieldsToUpdate);

    return vendor;
};

export const updateBankInfo = async (vendorId, data) => {
    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
        throw new Error("Vendor not found");
    }

    // Only update fields that are actually provided in the request body
    const fieldsToUpdate = {};
    const updatableFields = ["account_number", "ifsc_code", "bank_name", "account_type"];

    updatableFields.forEach((field) => {
        if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
            fieldsToUpdate[field] = data[field];
        }
    });

    // Update only those fields
    await vendor.update(fieldsToUpdate);

    return vendor;
};

export const updatePassword = async (vendorId, currentPassword, newPassword) => {
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
        throw new Error("Vendor not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, vendor.password);
    if (!isMatch) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    vendor.password = hashedPassword;

    await vendor.save();
    return true;
};