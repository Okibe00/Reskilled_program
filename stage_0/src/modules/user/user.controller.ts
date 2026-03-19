import { sendSuccess } from '../../common/utils/helper.res.js';
import userService from './user.service.js';
import { Response, Request, NextFunction } from 'express';

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.findAll();
      return sendSuccess(res, 200, 'Success', users);
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      return sendSuccess(res, 201, 'Success', user);
    } catch (error: any) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await userService.deleteUser(id);
      return sendSuccess(res, 200, 'success', user);
    } catch (error: any) {
      return next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await userService.updateUser(id, req.body);
      return sendSuccess(res, 201, 'Success', user);
    } catch (error: any) {
      return next(error);
    }
  }
}

export default new UserController();
