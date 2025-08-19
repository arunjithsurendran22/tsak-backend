import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../models/admin/admin-model';
import ApiResponse from '../utils/api-response';
import { adminService } from '../services';

/**
 * Create an admin
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const addAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminUserName, adminUserType, email, password } = req.body;
    const adminUser: IAdmin = await adminService.createAdmin(adminUserName, adminUserType, email, password);

    const apiRespose: ApiResponse<{ admin: IAdmin }> = new ApiResponse<{ admin: IAdmin }>();
    apiRespose.message = 'Success!';
    apiRespose.data = { admin: adminUser };
    apiRespose.statusCode = 201;
    res.json(apiRespose);
  } catch (e) {
    next(e);
  }
};

/**
 * Admin login
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { adminData, accessToken } = await adminService.adminLogin(email, password);

    const apiRespose: ApiResponse<{ admin: IAdmin; accessToken: string }> = new ApiResponse<{ admin: IAdmin; accessToken: string }>();
    apiRespose.message = 'Success!';
    apiRespose.data = { admin: adminData, accessToken: accessToken };
    apiRespose.statusCode = 201;
    res.json(apiRespose);
  } catch (e) {
    next(e);
  }
};

export default {
  addAdmin,
  adminLogin,
};
