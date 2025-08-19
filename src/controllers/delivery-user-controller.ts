import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utils/api-response';
import { deliveryUserSerivce, tokenService } from '../services';
import { IDeliveryUser } from '../models/delivery-user/delivery-user-model';

/**
 * Admin login
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const deliveryLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const  userData = await deliveryUserSerivce.deliveryLogin(email, password);

    const tokenData = await tokenService.generateAuthTokens(userData, 'delivery');
    
    const apiRespose: ApiResponse<{ deliveryUser: IDeliveryUser; tokens: any  }> = new ApiResponse<{ deliveryUser: IDeliveryUser; tokens: any  }>();
    apiRespose.message = 'Success!';
    apiRespose.data = { deliveryUser: userData, tokens: tokenData };
    apiRespose.statusCode = 201;
    res.json(apiRespose);
  } catch (e) {
    next(e);
  }
};

export default {
    deliveryLogin
}