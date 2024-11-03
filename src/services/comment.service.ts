import { Repository } from "typeorm";
import { Comment } from "../entity/Comment";
import { BlogService } from "./blog.service";
import { AppDataSource } from "../data-source";
import { CreateCommentDTO, CreateReplyDTO } from "../dto/comment/comment.dto";
import { createCommentMapper, createReplyMapper } from "../dto/comment/mappers";
import { io } from "../index";
import { NotificationService } from "./notification.service";
import { UserService } from "./user.service";

export class CommentService {
  private commentRepository: Repository<Comment>;
  private blogService: BlogService;
  private notificationService: NotificationService;
  private userService: UserService;

  constructor() {
    if (!AppDataSource.isInitialized) {
      AppDataSource.initialize()
        .then(() => {
          this.blogService = new BlogService();
          this.commentRepository = AppDataSource.getRepository(Comment);
          this.notificationService = new NotificationService();
          this.userService = new UserService();
        })
        .catch((error) => {
          console.error("Error during Data Source initialization:", error);
        });
      } else {
        this.commentRepository = AppDataSource.getRepository(Comment);
        this.blogService = new BlogService();
        this.userService = new UserService();
      this.notificationService = new NotificationService();
    }
  }

  async addComment(payload: CreateCommentDTO) {
    const { slug, userId } = payload;
    const blog = await this.blogService.getSingleBlog(slug);

    if (!blog) throw new Error("Blog not found");

    const comment = createCommentMapper({ ...payload, blogId: blog.id });
    const savedComment = await this.commentRepository.save(comment);

    if (blog.user.id !== userId) {
      const user = await this.userService.getUserById(userId);

      if (user) {
        await this.notificationService.createNotification(blog.user, user, blog, savedComment, "new-comment");
        io.emit("new-comment", {
          message: "New comment on your blog",
          blogId: blog.id,
          commentId: savedComment.id,
          commenterId: userId,
        });
      }
    }

    return savedComment;
  }

  async addReply(payload: CreateReplyDTO) {
    const { commentId, userId } = payload;
    const parentComment = await this.commentRepository.findOneBy({ id: commentId });
    if (!parentComment) throw new Error("Comment not found");

    const reply = createReplyMapper(payload);
    const savedReply = await this.commentRepository.save(reply);

    if (parentComment.user.id !== userId) {
      const user = await this.userService.getUserById(userId);
      const blog = await this.blogService.getSingleBlog(parentComment.blog.slug); 

      if (user && blog) {
        await this.notificationService.createNotification(parentComment.user, user, blog, savedReply, "new-reply");
        io.emit("new-reply", {
          message: "New reply to your comment",
          commentId: parentComment.id,
          replyId: savedReply.id,
          replierId: userId,
        });
      }
    }

    return savedReply;
  }

  async getCommentsForBlog(slug: string) {
    const blog = await this.blogService.getSingleBlog(slug);

    if (blog) {
      const comments = await this.commentRepository.find({
        where: { blog: { id: blog.id }, parent: null },
        relations: ["replies", "user"],
        order: { createdAt: "DESC" },
      });

      // Sort replies for each comment
      for (const comment of comments) {
        comment.replies = comment.replies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      return comments;
    }

    return [];
  }

  async getRepliesForComment(commentId: string) {
    return this.commentRepository.find({
      where: { parent: { id: commentId } },
      relations: ["user"],
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) throw new Error("Comment not found");

    if (comment.user.id !== userId) throw new Error("Unauthorized");

    return this.commentRepository.remove(comment);
  }
}
