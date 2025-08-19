import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user/user-model';
import ApiResponse from '../utils/api-response';
import profileService from '../services/profile-service';

/**
 * Get user profile
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;
    const userProfile = await profileService.getUserProfile(userId);

    const apiResponse = new ApiResponse<{ userProfile: IUser | null }>();
    apiResponse.message = 'Profile retrieved successfully!';
    apiResponse.data = { userProfile };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, name, email } = req.body;

    const updateData: Partial<IUser> = { name, email };
    const updatedProfile = await profileService.updateProfile(userId, updateData);

    const apiResponse = new ApiResponse<{ updatedProfile: IUser | null }>();
    apiResponse.message = 'Profile updated successfully!';
    apiResponse.data = { updatedProfile };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};



/**
 * Get all user profiles (admin access)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getAllProfilesAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { pageNumber = '1', pageSize = '10', searchTag = '', fromDate = '', toDate = '' } = req.query;

    const result = await profileService.getAllUsersAdmin(adminId, {
      pageNumber: parseInt(pageNumber as string, 10),
      pageSize: parseInt(pageSize as string, 10),
      searchTag: searchTag as string,
      fromDate: fromDate as string, 
      toDate: toDate as string
    });

    const apiResponse = new ApiResponse<typeof result>();
    apiResponse.message = 'Success!';
    apiResponse.data = result;
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Get profile details (admin viewing a specific user)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getProfileDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { userId } = req.params;

    const userProfile = await profileService.getProfileDetails(adminId, userId);

    const apiResponse = new ApiResponse<{ userProfile: IUser | null }>();
    apiResponse.message = 'Profile retrieved successfully!';
    apiResponse.data = { userProfile };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  getAllProfilesAdmin,
  getProfileDetails,
};
