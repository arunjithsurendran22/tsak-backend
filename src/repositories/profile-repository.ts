import { paginate } from '../helper/paginationHelper';
import USER from '../models/user/user';
import { IUser } from '../models/user/user-model';

/**
 * Get user by ID
 * @param {string} userId
 * @returns {Promise<IUser | null>}
 */
const getById = async (userId: string): Promise<IUser | null> => {
  return await USER.findById(userId).exec();
};

/**
 * Update user profile
 * @param {string} userId
 * @param {Partial<IUser>} updateData
 * @returns {Promise<IUser | null>}
 */
const update = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await USER.findByIdAndUpdate(userId, updateData, { new: true }).exec();
};

/**
 * Check if username already exists (excluding current user)
 * @param {string} name
 * @param {string} excludeUserId
 * @returns {Promise<IUser | null>}
 */
const findUserNameAlreadyExists = async (name: string, excludeUserId: string): Promise<IUser | null> => {
  return await USER.findOne({ name, _id: { $ne: excludeUserId } }).exec();
};

/**
 * Check if mobile number already exists (excluding current user)
 * @param {string} mobileNumber
 * @param {string} excludeUserId
 * @returns {Promise<IUser | null>}
 */
const findMobileNumberAlreadyExists = async (mobileNumber: string, excludeUserId: string): Promise<IUser | null> => {
  return await USER.findOne({ mobileNumber, _id: { $ne: excludeUserId } }).exec();
};

/**
 * Get all users (user access)
 * @param {object} options
 * @returns {Promise<{ users: IUser[], totalCount: number, hasNext: boolean }>}
 */
const getAllUsers = async ({
  userId,
  pageNumber,
  pageSize,
  searchTag,
}: {
  userId: string;
  pageNumber: number;
  pageSize: number;
  searchTag?: string;
}): Promise<{ users: IUser[]; totalCount: number; hasNext: boolean }> => {
  const query = {}; // you can add filters if needed
  const { data, totalCount, hasNext } = await paginate(USER, { pageNumber, pageSize }, query);
  return { users: data, totalCount, hasNext }; // 👈 Remap here!
};

/**
 * Get all users (admin access)
 * @param {object} options
 * @returns {Promise<{ users: IUser[], totalCount: number, hasNext: boolean }>}
 */
const getAllUsersAdmin = async ({
  pageNumber,
  pageSize,
  searchTag,
  fromDate,
  toDate
}: {
  pageNumber: number;
  pageSize: number;
  searchTag?: string;
  fromDate: string,
  toDate: string
}): Promise<{ users: IUser[]; totalCount: number; hasNext: boolean }> => {
  
  const query: any = {};

  if (searchTag) {
    query.$or = [
      { name: { $regex: searchTag, $options: 'i' } }, 
      { mobileNumber: { $regex: searchTag, $options: 'i' } },
    ];
  }

  if (fromDate && toDate) {

    let dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);
    let dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);

    query.createdAt = {
      $gte: dateFrom,
      $lte: dateTo
    }

  } else if (fromDate) {
    let dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);

    query.createdAt = {
      $gte: dateFrom
    }
  } else if (toDate) {
    let dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);

    query.createdAt = {
      $lte: dateTo
    }

  }

  const { data, totalCount, hasNext } = await paginate(USER, { pageNumber, pageSize }, query);
  
  return { users: data, totalCount, hasNext };
};


export default {
  getById,
  update,
  findUserNameAlreadyExists,
  findMobileNumberAlreadyExists,
  getAllUsers,
  getAllUsersAdmin,
};
