import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ERROR from '../web_server/http-error';
import config from '../../config/config';

/**
 * @function verifyUser //verify header token and extract user ID
 * @param req
 * @param res
 * @param next
 */
export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw new ERROR.BadRequestError('Authorization Error: Token missing!');
    jwt.verify(token, config.jwt.secret as string, (err: any, payload: any) => {
      if (err) throw new ERROR.AuthorizationError('Authorization Error: Token verification failed!');
      if (payload.role !== 'user') throw new ERROR.AuthorizationError('Authorization Error: Invalid role!');
      req.body.userId = payload.sub;
      next();
    });
  } catch (e) {
    next(e);
  }
};

