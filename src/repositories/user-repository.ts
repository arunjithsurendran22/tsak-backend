import { IUser } from '../models/user/user-model';
import UserEntity from '../entities/user-entity';
import USER from '../models/user/user';
import { Types } from 'mongoose';

/**
 * Add new user entry to database
 * @param {UserEntity} userEntity
 * @returns {Promise<IUser>}
 */
const createNewUser = async (userEntity: UserEntity): Promise<IUser> => {
  const userData = await new USER(userEntity).save();
  return userData;
};

/**
 * Find user entry by matching country code and phone number
 * @param { String } countryCode
 * @param { String } mobileNumber
 * @returns { Promise<IUser | null> }
 */
const findUser = async (countryCode: string, mobileNumber: string): Promise<IUser | null> => {
  const userData: IUser | null = await USER.findOne({ countryCode, mobileNumber, documentStatus: true });
  return userData;
};

/**
 * Find User by matching user name
 * @param { String } userName
 * @returns { Promise<IUser | null>}
 */
const findUserByUserName = async (userName: string): Promise<IUser | null> => {
  const userData: IUser | null = await USER.findOne({ userName, documentStatus: true });
  return userData;
};

const findUserByReferralCode = async (referralCode: string): Promise<IUser | null> => {
  const userData: IUser | null = await USER.findOne({ referralCode, documentStatus: true });
  return userData;
};

/**
 * Save fcm token in user document
 * @param { String } userId
 * @param { String } fcmToken
 */
const addFCMToken = async (userId: string, fcmToken: string) => {
  USER.findByIdAndUpdate(userId, { $addToSet: { fcmTokens: fcmToken } });
};

/**
 * Find a user by id
 * @param { String } id
 * @returns { Promise<IUser | null> }
 */
const findUserById = async (id: Types.ObjectId): Promise<IUser | null> => {
  const userData: IUser | null = await USER.findOne({ _id: id, documentStatus: true });
  return userData;
};

/**
 *Get profiles count
 * @param filter
 * @returns { Promise<number> }
 */
const getProfilesCount = async (searchTag: string, isVerified: string, fromDate: string, toDate: string): Promise<number> => {
  const findQuery: any = {
    documentStatus: true,
  };
  //apply verified filter
  if (isVerified && isVerified == 'true') findQuery.isVerified = true;
  if (isVerified && isVerified == 'false') findQuery.isVerified = false;

  if (fromDate) {
    const dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);

    findQuery.createdAt = {
      $gte: dateFrom,
    };
  }

  if (toDate) {
    const dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);

    findQuery.createdAt = {
      $lte: dateTo,
    };
  }

  if (fromDate && toDate) {
    const dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);
    const dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);

    findQuery.createdAt = {
      $gte: dateFrom,
      $lte: dateTo,
    };
  }
  //apply searchTag
  if (searchTag) {
    const searchQuery = {
      $or: [
        { userName: { $regex: searchTag, $options: 'i' } },
        { name: { $regex: searchTag, $options: 'i' } },
        { mobileNumber: { $regex: searchTag, $options: 'i' } },
        { email: { $regex: searchTag, $options: 'i' } },
      ],
    };
    Object.assign(findQuery, searchQuery);
  }

  return await USER.countDocuments(findQuery);
};

/**
 * Get all  profiles
 * @param {number} skip
 * @param {number} limit
 * @param {string} searchTag
 * @param {string} isVerified
 * @param {string} fromDate
 * @param {string} toDate
 * @returns
 */
const getAllProfiles = async (skip: number, limit: number, searchTag: string, isVerified: string, fromDate: string, toDate: string) => {
  const findQuery: any = {
    documentStatus: true,
  };

  //apply verified filter
  if (isVerified && isVerified == 'true') findQuery.isVerified = true;
  if (isVerified && isVerified == 'false') findQuery.isVerified = false;

  if (fromDate) {
    const dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);

    findQuery.createdAt = {
      $gte: dateFrom,
    };
  }

  if (toDate) {
    const dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);

    findQuery.createdAt = {
      $lte: dateTo,
    };
  }

  if (fromDate && toDate) {
    const dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);
    const dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);

    findQuery.createdAt = {
      $gte: dateFrom,
      $lte: dateTo,
    };
  }

  //apply searchTag
  if (searchTag) {
    const searchQuery = {
      $or: [
        { userName: { $regex: searchTag, $options: 'i' } },
        { name: { $regex: searchTag, $options: 'i' } },
        { mobileNumber: { $regex: searchTag, $options: 'i' } },
        { email: { $regex: searchTag, $options: 'i' } },
      ],
    };
    Object.assign(findQuery, searchQuery);
  }

  return await USER.find(
    findQuery,
    '_id name profileImageUrl email countryCode mobileNumber coinBalance referralCode referrredBy createdAt',
  )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 *Get referral count
 * @param filter
 * @returns { Promise<number> }
 */
 const getReferralCount = async (referralCode: string): Promise<number> => {
  const findQuery: any = {
    documentStatus: true,
    referredBy: referralCode
  };

  return await USER.countDocuments(findQuery);
};

/**
 * Get all  profiles
 * @param {number} skip
 * @param {number} limit
 * @param {string} searchTag
 * @param {string} isVerified
 * @param {string} fromDate
 * @param {string} toDate
 * @returns
 */
const getAllReferrals = async (skip: number, limit: number, referralCode: string) => {
  const findQuery: any = {
    documentStatus: true,
    referredBy: referralCode
  };

  return await USER.find(
    findQuery,
    '_id name profileImageUrl email countryCode mobileNumber coinBalance referralCode referrredBy createdAt',
  )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * get one user profile
 * @param {string} userId
 * @returns
 */
const findUserProfile = async (userId: string) => {
  return await USER.findOne(
    { _id: new Types.ObjectId(userId), documentStatus: true },
    '_id name profileImageUrl email countryCode mobileNumber coinBalance referralCode referredBy createdAt',
  );
};

/**
 * update user data
 * @param {string} userId
 * @param {any} updateData
 * @returns
 */
const updateUserData = async (userId: string, updateData: any) => {
  return await USER.findByIdAndUpdate(userId, updateData, { new: true });
};

export default {
  createNewUser,
  findUser,
  findUserByUserName,
  addFCMToken,
  findUserById,
  getProfilesCount,
  getAllProfiles,
  findUserProfile,
  updateUserData,
  findUserByReferralCode,
  getReferralCount,
  getAllReferrals
};
