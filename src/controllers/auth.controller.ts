import { Request, Response } from 'express';
import { UserService } from '../services';
import { getErrorMessage } from '../utils';
import { RequestWithUser } from '../types';
import { userMapper } from '../dto';
import { User } from '../entity/User';

const userService = new UserService()

export class UserController {

  async signup(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: getErrorMessage(error) });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
  
    try {
      const user = await userService.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { jwt, updated_at } = userService.generateJWT(user);
      return res.status(200).json({ jwt, updated_at });
    } catch (error) {
      return res.status(500).json({ message: getErrorMessage(error) });
    }
  }

  async getCurrentUser(req: RequestWithUser, res: Response) {
    try {
      if (req.user_id) { 
        const user = await userService.getUserById(req.user_id)
        
        if(user){
          return res.status(200).json(userMapper(user as User));
        }
      }
      
      return res.status(401).json({ message: 'Unauthorized' });
    } catch (error) {
      return res.status(500).json({ message: getErrorMessage(error) });
    }
  }
}
