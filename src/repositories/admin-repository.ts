import AdminEntity from '../entities/admin-entity';
import ADMIN from '../models/admin/admin';
import { IAdmin } from '../models/admin/admin-model';

/**
 * Create new admin
 * @param {AdminEntity} adminEntity
 * @returns {Promise<IAdmin>}
 */
const create = async (adminEntity: AdminEntity): Promise<IAdmin> => {
  const adminData = await new ADMIN(adminEntity).save();
  return adminData;
};

/**
 * Find email already used or not
 * @param { String } email
 * @returns {Promise<Boolean>}
 */
const isEmailTaken = async (email: string): Promise<boolean> => {
  const adminData = await ADMIN.findOne({ email, documentStatus: true });
  return !!adminData;
};
/**
 * Find admin by email
 * @param {string} email
 */
const findByEmail = async (email: string) => {
  const adminData = await ADMIN.findOne({ email, documentStatus: true });
  return adminData;
};

export default {
  create,
  isEmailTaken,
  findByEmail,
};
