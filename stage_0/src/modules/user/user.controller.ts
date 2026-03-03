import userService from './user.service.js';
import { Response, Request } from 'express';

class UserController {
  async getAll(req: Request, res: Response) {
    const users = await userService.findAll();
    res.status(200).json(users);
  }

  async create(req: Request, res: Response) {
    try {
      //validation not implemented yet
      // console.log("body structure", req.body)
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new UserController();
