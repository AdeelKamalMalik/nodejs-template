import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../services';

const userService = new UserService();

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await userService.getUserById((decoded as any).id);
    
    if (!user) return res.sendStatus(403);

    req.user_id = user.id;

    next();
  } catch (err) {
    res.sendStatus(403);
  }
};
