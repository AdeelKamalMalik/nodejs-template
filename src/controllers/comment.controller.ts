import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { RequestWithUser } from '../types';
import cloudinary from '../config/cloudinary';

const commentService = new CommentService();

export class CommentController {

  async addComment(req: RequestWithUser, res: Response) {
    const { slug } = req.params;
    const { body } = req.body;

    const userId = req.user_id;
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
    
    try {
      const comment = await commentService.addComment({ body, slug, userId, image: imageUrl });
      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async addReply(req: RequestWithUser, res: Response) {
    const { commentId } = req.params;
    const { body } = req.body;
    const userId = req.user_id;

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

    try {
      const reply = await commentService.addReply({ commentId, userId, body, image: imageUrl });
      res.status(201).json(reply);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getComments(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const comments = await commentService.getCommentsForBlog(slug);
      res.json(comments);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getReplies(req: Request, res: Response) {
    const { commentId } = req.params;

    try {
      const replies = await commentService.getRepliesForComment(commentId);
      res.json(replies);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteComment(req: RequestWithUser, res: Response) {
    const { commentId } = req.params;
    const userId = req.user_id;

    try {
      await commentService.deleteComment(commentId, userId);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
