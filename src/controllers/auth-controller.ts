import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user/user-model';
import ApiResponse from '../utils/api-response';
import { authService, fcmTokenService, tokenService } from '../services';

/**
 * Login
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const obj = req.body;
    let fcmToken: string = '';
    if (req.headers['fcm-token']) fcmToken = req.headers['fcm-token'] as string;
    //authenticate user
    const userData: any = await authService.authUser(obj);
    //generate token
    const tokenData = await tokenService.generateAuthTokens(userData, 'user');
    //save fcm token
    if (fcmToken) fcmTokenService.saveFCMToken(userData._id.toString(), fcmToken);
    //send response
    const apiRespose: ApiResponse<{ user: IUser; tokens: any }> = new ApiResponse<{ user: IUser; tokens: any }>();
    apiRespose.message = 'Success!';
    apiRespose.data = { user: userData, tokens: tokenData };
    apiRespose.statusCode = 200;
    res.json(apiRespose);
  } catch (e) {
    next(e);
  }
};

/**
 * Check user exists
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
const checkUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const obj = req.body;
      //authenticate user
      let userExistsResponse = await authService.findUserExists(obj);
      //send response
      let authUserResponse: ApiResponse<{ userExists: boolean }> = new ApiResponse<{ userExists: boolean }>();
      authUserResponse.message = 'Success!';
      authUserResponse.data = {userExists: userExistsResponse};
      res.json(authUserResponse);
  } catch (error) {
      next(error);
  }
}

/**
 * Log out user
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const logOutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.logOut(req.body.refreshToken);
    const apiRespose: ApiResponse<{}> = new ApiResponse<{}>();
    apiRespose.message = 'Success!';
    apiRespose.data = {};
    apiRespose.statusCode = 200;
    res.json(apiRespose);
  } catch (e) {
    next(e);
  }
};

/**
 * Refresh token
 * @param req
 * @param res
 * @param next
 */
const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    const apiRespose: ApiResponse<{ tokens: any }> = new ApiResponse<{ tokens: any }>();
    apiRespose.message = 'Success!';
    apiRespose.data = { tokens: tokens };
    apiRespose.statusCode = 200;
    res.json(apiRespose);
  } catch (e) {
    next(e);
  }
};

export default {
  authenticateUser,
  logOutUser,
  refreshTokens,
  checkUserExists
};
