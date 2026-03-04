import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { sendError, sendSuccess } from '../../common/utils/helper.res.js';

class Auth {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const data = await authService.login(email, password);
      return sendSuccess(res, 200, 'Login successful', data);
    } catch (error) {
      return sendError(res, 401, 'Unauthorized', 'Invalid email or password');
    }
  }
  async signup(req: Request, res: Response) {
    try {
      const data = await authService.signup(req.body);
      return sendSuccess(res, 201, 'Resource created', data);
    } catch (error) {
      return sendError(res, 400, 'Failed to  create  resource', 'Bad request');
    }
  }
}

export default new Auth();
