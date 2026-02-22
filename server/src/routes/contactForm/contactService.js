import Contact from "../../models/contactModel.js";

export const createContact = async (data) => {
    try {
        const contact = await Contact.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
        });
        return contact;
    } catch (err) {
        console.error("❌ DB Error:", err);
        throw new Error("Database error while saving contact");
    }
};