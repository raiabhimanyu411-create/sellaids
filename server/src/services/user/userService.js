import bcrypt from "bcryptjs";
import { User } from "../../models/userModel.js";

export const getUserById = async (userId) => {
    return await User.findByPk(userId);
};

export const updateProfile = async (userId, name, phone, address_line, city, state, pincode, currentPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address_line !== undefined) user.address_line = address_line;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;

    // Handle password update only if currentPassword is provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    } else if (currentPassword && !newPassword) {
      throw new Error("New password is required when current password is provided");
    }

    await user.save();
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};