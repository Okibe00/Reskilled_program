import { Request, Response, NextFunction } from 'express';
import authService from './auth.service.js';
import { sendSuccess } from '../../common/utils/helper.res.js';

class Auth {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const data = await authService.login(email, password);
      return sendSuccess(res, 200, 'Login successful', data);
    } catch (error: any) {
      return next(error);
    }
  }
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.signup(req.body);
      return sendSuccess(res, 201, 'Resource created', data);
    } catch (error: any) {
      return next(error);
    }
  }
}

export default new Auth();
