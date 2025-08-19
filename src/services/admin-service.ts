import AdminEntity from '../entities/admin-entity';
import ERROR from '../middlewares/web_server/http-error';
import { IAdmin } from '../models/admin/admin-model';
import * as argon2 from 'argon2';
import { adminRepository } from '../repositories';
import jwt from 'jsonwebtoken';

/**
 * Create an admin
 * @param {String} adminUserName
 * @param {String} adminUserType
 * @param {String} email
 * @param {String} password
 * @returns {Promise<IAdmin>}
 */
const createAdmin = async (adminUserName: string, adminUserType: string, email: string, password: string): Promise<IAdmin> => {
  //check email already exists or not
  if (await adminRepository.isEmailTaken(email)) {
    throw new ERROR.DocumentExistsError('Email already taken!');
  }
  //encrypt password using argon2
  const hash = await argon2.hash(password);
  //create new admin
  const adminEntity: AdminEntity = new AdminEntity(true, adminUserName, adminUserType, email, hash, null, new Date(), null, new Date());
  return await adminRepository.create(adminEntity);
};

/**
 *
 * @param { String } email
 * @param { String } password
 */
const adminLogin = async (email: string, password: string) => {
  //find admin user with email
  const adminData: IAdmin | null = await adminRepository.findByEmail(email);
  if (adminData && adminData._id) {
    //verify password and return user data
    if (await argon2.verify(adminData.password, password)) {
      //generate access token
      const tokenData = {
        _id: adminData._id,
        userName: adminData.adminUserName,
        userType: 'admin',
        email: adminData.email,
      };
      const accessToken: string = jwt.sign(tokenData, process.env.JWT_SECRET as string);

      return { adminData, accessToken };
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
  createAdmin,
  adminLogin,
};
