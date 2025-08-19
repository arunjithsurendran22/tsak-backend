import DELIVERY_USER from "../models/delivery-user/delivery-user";

/**
 * Find user by email
 * @param {string} email
 */
const findByEmail = async (email: string) => {
    const adminData = await DELIVERY_USER.findOne({ email, documentStatus: true });
    return adminData;
};

export default {
    findByEmail
}