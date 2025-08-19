import { IUser } from '../models/user/user-model';
import profileRepository from '../repositories/profile-repository';
import { validateDocumentExists, validateNotFound, validateRequiredField, validateUserAuthorization, validateUserExists } from '../utils/validators';

/**
 * Get user profile by userId
 * @param {string} userId
 * @returns {Promise<IUser | null>}
 */
const getUserProfile = async (userId: string): Promise<IUser | null> => {
  validateUserAuthorization(userId);
  const userProfile = await profileRepository.getById(userId);
  validateNotFound(userProfile, 'userProfile');
  return userProfile;
};

/**
 * Update user profile
 * @param {string} userId
 * @param {Partial<IUser>} updateData
 * @returns {Promise<IUser | null>}
 */
const updateProfile = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  validateUserAuthorization(userId);

  const existingUser = await profileRepository.getById(userId);
  validateNotFound(existingUser, 'existingUser');

  if (updateData.name) {
    const existingUserName = await profileRepository.findUserNameAlreadyExists(updateData.name, userId);
    validateUserExists(existingUserName);
  }

  if (updateData.mobileNumber) {
    const existingMobileNumber = await profileRepository.findMobileNumberAlreadyExists(updateData.mobileNumber, userId);
    validateDocumentExists(existingMobileNumber, 'mobileNumber');
  }

  const updatedProfile = await profileRepository.update(userId, updateData);
  validateNotFound(updatedProfile, 'updatedProfile');
  return updatedProfile;
};



/**
 * Get all users for admin
 * @param {string} adminId
 * @param {object} options
 * @returns {Promise<{ users: IUser[], totalCount: number, hasNext: boolean }>}
 */
const getAllUsersAdmin = async (
  adminId: string,
  {
    pageNumber,
    pageSize,
    searchTag,
    fromDate, 
    toDate,
  }: {
    pageNumber: number;
    pageSize: number;
    searchTag: string;
    fromDate: string;
    toDate: string;
  }
): Promise<{ users: IUser[]; totalCount: number; hasNext: boolean }> => {
  validateUserAuthorization(adminId);
  return await profileRepository.getAllUsersAdmin({ pageNumber, pageSize, searchTag, fromDate, toDate });
};

/**
 * Get user profile details by admin
 * @param {string} adminId
 * @param {string} userId
 * @returns {Promise<IUser | null>}
 */
const getProfileDetails = async (adminId: string, userId: string): Promise<IUser | null> => {
  validateUserAuthorization(adminId);
  validateRequiredField(userId, 'userId');

  const userProfile = await profileRepository.getById(userId);
  validateNotFound(userProfile, 'userProfile');
  return userProfile;
};

export default {
  getUserProfile,
  updateProfile,
  getAllUsersAdmin,
  getProfileDetails,
};
