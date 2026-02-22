import { Admin } from "../../models/adminModel.js";
import bcrypt from "bcryptjs";

export const getAdminProfileService = async (adminId) => {
    const admin = await Admin.findByPk(adminId, {
      attributes: ["name", "phone"]
    });
  
    if (!admin) {
      throw new Error("Admin not found");
    }
  
    return admin;
  };

export const updateAdminProfileService = async (adminId, { name, phone, password }) => {
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const admin = await Admin.findByPk(adminId);

    if (!admin) {
        throw new Error("Admin not found");
    }

    await admin.update(updateData);

    // Remove password from returned data
    const { password: _, ...adminData } = admin.toJSON();
    return adminData;
};
