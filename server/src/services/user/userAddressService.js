import { User } from "../../models/userModel.js";
import { userAddressSchema } from "../../validations/addressValidation.js";

export const addAddressService = async (userId, addressData) => {
    const validatedData = await userAddressSchema.validate(addressData, { abortEarly: false });
    await User.update(validatedData, { where: { id: userId } });
    return validatedData;
};

export const getAddressService = async (userId) => {
    const user = await User.findOne({ where: { id: userId }, attributes: ["address_line", "city", "state", "pincode"] });
    if (!user) throw new Error("Address not found");
    return user;
};

export const updateAddressService = async (userId, addressData) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const updatedData = {
        address_line: addressData.address_line ?? user.address_line,
        city: addressData.city ?? user.city,
        state: addressData.state ?? user.state,
        pincode: addressData.pincode ?? user.pincode,
    };

    await User.update(updatedData, { where: { id: userId } });
    return updatedData;
};

