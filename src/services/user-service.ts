import { Types } from 'mongoose';
import ERROR from '../middlewares/web_server/http-error';
import { IUser } from '../models/user/user-model';
import { userRepository } from '../repositories';

/**
 * List profiles
 * @param { string } pageNumber
 * @param { string } pageSize
 * @param { string } searchTag
 * @param { string } isVerified
 * @returns {Promise<{profiles: IUser[], hasNext: boolean}> }
 */
const listProfiles = async (
  pageNumber: string,
  pageSize: string,
  searchTag: string,
  isVerified: string,
  fromDate: string,
  toDate: string,
): Promise<{ profiles: IUser[]; hasNext: boolean }> => {
  let skip = 0;
  let limit = 12;
  let hasNext = false;

  if (pageSize) limit = parseInt(pageSize);
  if (pageNumber) skip = (parseInt(pageNumber) - 1) * limit;

  const count = await userRepository.getProfilesCount(searchTag, isVerified, fromDate, toDate);
  if (!pageSize) limit = count;
  const profiles = await userRepository.getAllProfiles(skip, limit, searchTag, isVerified, fromDate, toDate);

  if (count > skip + limit) hasNext = true;
  return { profiles, hasNext };
};

/**
 * Get user profile details
 * @param { string } userId
 * @returns
 */
const findProfileDetails = async (userId: string): Promise<IUser | null> => {
  if (!userId) {
    throw new ERROR.BadRequestError('user id missing!');
  } else {
    const userData = await userRepository.findUserProfile(userId);
    if (userData && userData._id) {
      return userData;
    } else {
      throw new ERROR.NotFoundError('User details not found!');
    }
  }
};

/**
 * Update user profile details
 * @param { any } obj
 * @returns
 */
const updateProfileDetails = async (obj: any): Promise<IUser | null> => {

  const updateData = {
    name: obj.name,
    email: obj.email,
  };

  return await userRepository.updateUserData(obj.loginUserId, updateData);
};

/**
 * Update user profile image
 * @param { any } obj
 * @returns
 */
const updateProfileImage = async (obj: any): Promise<IUser | null> => {
  const updateData = {
    profileImageUrl: obj.profileImageUrl,
  };

  return await userRepository.updateUserData(obj.loginUserId, updateData);
};

/**
 * Update subscription amount
 * @param { any } obj
 * @returns
 */
const updateSubscriptionAmount = async (obj: any): Promise<IUser | null> => {
  const updateData = {
    subscriptionAmountDaily: obj.subscriptionAmountDaily,
    subscriptionAmountWeekly: obj.subscriptionAmountWeekly,
    subscriptionAmountMonthly: obj.subscriptionAmountMonthly,
  };

  return await userRepository.updateUserData(obj.loginUserId, updateData);
};

/**
 * Check username exists or not
 * @param { string } userName
 */
const userNameExists = async (userName: string) => {
  const userData = await userRepository.findUserByUserName(userName);
  return userData && userData._id ? userData._id.toString() : '';
};

/**
 * update user verification status
 * @param {string}userId
 * @param {boolean}status
 */
const changeVerificationStatus = async (userId: string, status: boolean) => {
  const updateData = {
    isVerified: status,
    updatedAt: new Date(),
  };
  await userRepository.updateUserData(userId, updateData);
};

/**
 * List profiles
 * @param { string } pageNumber
 * @param { string } pageSize
 * @param { string } searchTag
 * @param { string } isVerified
 * @returns {Promise<{profiles: IUser[], hasNext: boolean}> }
 */
const getReferralList = async (
  pageNumber: string,
  pageSize: string,
  userId: string
): Promise<{ profiles: IUser[]; hasNext: boolean }> => {

  let userData = await userRepository.findUserById(new Types.ObjectId(userId))

  if (userData && userData.referralCode) {
    let skip = 0;
    let limit = 12;
    let hasNext = false;

    if (pageSize) limit = parseInt(pageSize);
    if (pageNumber) skip = (parseInt(pageNumber) - 1) * limit;

    const count = await userRepository.getReferralCount(userData.referralCode);
    if (!pageSize) limit = count;
    const profiles = await userRepository.getAllReferrals(skip, limit, userData.referralCode);

    if (count > skip + limit) hasNext = true;
    return { profiles, hasNext };
  } else {
    throw new ERROR.NotFoundError("user not found!")
  }

};

export default {
  listProfiles,
  findProfileDetails,
  userNameExists,
  updateProfileDetails,
  changeVerificationStatus,
  updateProfileImage,
  updateSubscriptionAmount,
  getReferralList
};
