import { Request, Response } from 'express';
import { UserService } from '../services';
import { getErrorMessage } from '../utils';

const userService = new UserService()
export class UserController {

  async list(req: Request, res: Response) {
    try {
      const users = await userService.getAll()
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ message: getErrorMessage(error) });
    }
  }

}
