import userService from './user.service.js';
import { Response, Request } from 'express';

class UserController {
  async getAll(req: Request, res: Response) {
    const users = await userService.findAll();
    res.status(200).json(users);
  }

  async create(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await userService.deleteUser(id);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await userService.updateUser(id, req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new UserController();
