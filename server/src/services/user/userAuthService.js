import bcrypt from "bcryptjs"
import { User } from "../../models/userModel.js"
import crypto from "crypto";
import { Op } from "sequelize";

export const registerUser = async ({ name, email, phone, password, address_line, city, state, pincode }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        address_line,
        city,
        state,
        pincode,

    });

    return newUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    return user;
};

export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await User.update(
        { reset_token: resetToken, reset_token_expires: resetTokenExpires },
        { where: { email } }
    );

    return resetToken;
};

export const resetPasswordService = async (token, newPassword) => {
    const user = await User.findOne({
        where: { reset_token: token, reset_token_expires: { [Op.gt]: new Date() } },
    });
    if (!user) throw new Error("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
        { password: hashedPassword, reset_token: null, reset_token_expires: null },
        { where: { id: user.id } }
    );

    return user;
};