import { Repository } from "typeorm";
import { Comment } from "../entity/Comment";
import { BlogService } from './blog.service';
import { AppDataSource } from "../data-source";
import { CreateCommentDTO, CreateReplyDTO } from "../dto/comment/comment.dto";
import { createCommentMapper, createReplyMapper } from "../dto/comment/mappers";

export class CommentService {
  private commentRepository: Repository<Comment>;
  private blogService: BlogService;

  constructor() {
    if (!AppDataSource.isInitialized) {
      AppDataSource.initialize().then(() => {
        this.blogService = new BlogService();
        this.commentRepository = AppDataSource.getRepository(Comment);
      }).catch(error => {
        console.error('Error during Data Source initialization:', error);
      });
    } else {
      this.commentRepository = AppDataSource.getRepository(Comment);
      this.blogService = new BlogService();
    }
  }

  async addComment(payload: CreateCommentDTO) {
    const { slug } = payload
    const blog = await this.blogService.getSingleBlog(slug);

    if (!blog) throw new Error('Blog not found');

    const comment = createCommentMapper({ ...payload, blogId: blog.id })

    return this.commentRepository.save(comment);
  }

  async addReply(payload: CreateReplyDTO) {
    const { commentId } = payload
    console.log(":::::::::::", payload)
    const parentComment = await this.commentRepository.findOneBy({ id: commentId });
    if (!parentComment) throw new Error('Comment not found');

    const reply = createReplyMapper(payload)

    return this.commentRepository.save(reply);
  }

  async getCommentsForBlog(slug: string) {
    const { id } = await this.blogService.getSingleBlog(slug);
    
    if (id) {
      const comments = await this.commentRepository.find({
        where: { blog: { id }, parent: null },
        relations: ['replies', 'user'],
        order: { createdAt: 'DESC' },
      });
  
      // Sort replies for each comment
      for (const comment of comments) {
        comment.replies = comment.replies.sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime(); 
        });
      }
  
      return comments;
    }
  
    return [];
  }
  

  async getRepliesForComment(commentId: string) {
    return this.commentRepository.find({
      where: { parent: { id: commentId } },
      relations: ['user'],
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) throw new Error('Comment not found');

    if (comment.user.id !== userId) throw new Error('Unauthorized');

    return this.commentRepository.remove(comment);
  }
}
