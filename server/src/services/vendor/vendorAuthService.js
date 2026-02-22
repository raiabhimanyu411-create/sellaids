import bcrypt from "bcryptjs"
import { Vendor } from "../../models/vendorModel.js"
import crypto from "crypto";
import { Op } from "sequelize";

export const registerVendor = async (vendorData) => {
    const { email, password } = vendorData
    const existingVendor = await Vendor.findOne({ where: { email } });
    if (existingVendor) throw new Error("Vendor already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await Vendor.create({
        ...vendorData,
        password: hashedPassword,
    });

    return newVendor;
};

export const loginVendor = async ({ email, password }) => {
    const vendor = await Vendor.findOne({ where: { email } });
    if (!vendor) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, vendor.password);
    if (!match) throw new Error("Invalid email or password");

    return vendor;
};

export const forgotPasswordService = async (email) => {
    const vendor = await Vendor.findOne({ where: { email } });
    if (!vendor) throw new Error("Vendor not found");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Vendor.update(
        { reset_token: resetToken, reset_token_expires: resetTokenExpires },
        { where: { email } }
    );

    return resetToken;
};

export const resetPasswordService = async (token, newPassword) => {
    const vendor = await Vendor.findOne({
        where: { reset_token: token, reset_token_expires: { [Op.gt]: new Date() } },
    });
    if (!vendor) throw new Error("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Vendor.update(
        { password: hashedPassword, reset_token: null, reset_token_expires: null },
        { where: { id: vendor.id } }
    );

    return vendor;
};