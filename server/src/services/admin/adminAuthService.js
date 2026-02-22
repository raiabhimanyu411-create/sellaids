import bcrypt from "bcryptjs"
import { Admin } from "../../models/adminModel.js"
import crypto from "crypto";
import { Op } from "sequelize";

export const registerAdmin = async ({ name, email, phone, password }) => {
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) throw new Error("Admin already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
        name,
        email,
        phone,
        password: hashedPassword,
    });

    return newAdmin;
};

export const loginAdmin = async ({ email, password }) => {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error("Invalid email or password");

    return admin;
};

export const forgotPasswordService = async (email) => {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) throw new Error("Admin not found");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Admin.update(
        { reset_token: resetToken, reset_token_expires: resetTokenExpires },
        { where: { email } }
    );

    return resetToken;
};

export const resetPasswordService = async (token, newPassword) => {
    const admin = await Admin.findOne({
        where: { reset_token: token, reset_token_expires: { [Op.gt]: new Date() } },
    });
    if (!admin) throw new Error("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Admin.update(
        { password: hashedPassword, reset_token: null, reset_token_expires: null },
        { where: { id: admin.id } }
    );

    return admin;
};