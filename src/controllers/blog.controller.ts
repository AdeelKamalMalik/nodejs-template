import { Request, Response } from 'express';
import { BlogService } from '../services';
import { RequestWithUser } from '../types';

const blogService = new BlogService()

export class BlogController {
  async createBlog(req: RequestWithUser, res: Response) {
    try {
      const { user_id } = req
      const blog = await blogService.createBlog({...req.body, userId: user_id });
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedBlog = await blogService.updateBlog(id, updates);
      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogService.getAllBlogs();
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
