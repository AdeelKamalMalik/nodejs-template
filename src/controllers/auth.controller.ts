import { Request, Response } from 'express';
import { UserService } from '../services';
import { getErrorMessage } from '../utils';
import { RequestWithUser } from '../types';
import { User } from '../entity/User';
import { userMapper } from '../dto/user/mappers';
import cloudinary from '../config/cloudinary';

const userService = new UserService()

export class AuthController {

  async signup(req: Request, res: Response) {
    try {
      const profileImage = req.file;
        
      let profileImageUrl: string | null = null;
  
      if (profileImage) {
        // Use Promises with upload_stream to handle the async behavior
        profileImageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              return reject(error); // Handle upload error
            }
            resolve(result?.secure_url); // Return the secure_url of the uploaded image
          });

          // Pipe the buffer to the upload stream
          uploadStream.end(profileImage.buffer);
        });
      }

      const user = await userService.createUser({...req.body, avatar: profileImageUrl || ''});
      return res.status(201).json(user);
    } catch (error) {
      console.log(error)
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
      return res.status(200).json({ jwt, updated_at, user });
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
