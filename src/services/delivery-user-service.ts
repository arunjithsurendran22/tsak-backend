import ERROR from "../middlewares/web_server/http-error";
import { IDeliveryUser } from "../models/delivery-user/delivery-user-model";
import * as argon2 from 'argon2';
import { deliveryUserRepository } from "../repositories";


/**
 *
 * @param { String } email
 * @param { String } password
 */
const deliveryLogin = async (email: string, password: string) => {
    //find admin user with email
    const deliveryUserData: IDeliveryUser | null = await deliveryUserRepository.findByEmail(email);
    if (deliveryUserData && deliveryUserData._id) {
        //verify password and return user data
        if (await argon2.verify(deliveryUserData.password, password)) {
            return deliveryUserData;
        } else {
            //throw error
            throw new ERROR.InvalidInputError('Incorrect password!');
        }
    } else {
        //throw error
        throw new ERROR.NotFoundError('Email not found!');
    }
};

export default {
    deliveryLogin
}