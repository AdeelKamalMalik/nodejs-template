import { Request, Response } from 'express';
import { BlogService } from '../services';
import { GetBlogsPayload, RequestWithUser } from '../types';
import cloudinary from '../config/cloudinary';

const blogService = new BlogService()

export class BlogController {
  async createBlog(req: RequestWithUser, res: Response) {
    try {
      const { user_id } = req
      const image = req.file;
        
      let imageUrl: string | null = null;
  
      if (image) {
        imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result?.secure_url);
          });

          uploadStream.end(image.buffer);
        });
      }

      const blog = await blogService.createBlog({...req.body, image: imageUrl, userId: user_id });
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      console.log(req.params, "::::::::")
      const { slug } = req.params;
      const updates = req.body;
      const image = req.file;
        
      let imageUrl: string | null = null;
  
      if (image) {
        imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result?.secure_url);
          });

          uploadStream.end(image.buffer);
        });
      }

      const updatedBlog = await blogService.updateBlog(slug, {...updates, image: imageUrl });
      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogService.getAllBlogs(req.query as unknown as GetBlogsPayload);
      res.status(200).json(blogs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSingleBlog(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const blog = await blogService.getSingleBlog(slug);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      await blogService.incrementBlogViews(slug);
      res.status(200).json(blog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
