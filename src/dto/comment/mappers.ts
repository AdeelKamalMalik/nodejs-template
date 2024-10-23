import { Blog } from "../../entity/Blog";
import { Comment } from "../../entity/Comment";
import { User } from "../../entity/User";
import { CreateCommentDTO, CreateReplyDTO } from "./comment.dto";

export function createCommentMapper(payload: CreateCommentDTO): Comment {
  const comment = new Comment();

  const { body, blogId, userId, image } = payload
  comment.body = body;
  comment.image = image || null;
  comment.blog = { id: blogId } as Blog;
  comment.user = { id: userId } as User;

  return comment;
}

export function createReplyMapper(payload: CreateReplyDTO): Comment {
  const reply = new Comment();

  const { body, commentId, userId, image } = payload
  reply.body = body;
  reply.image = image || null;
  reply.parent = { id: commentId } as Comment;
  reply.user = { id: userId } as User;

  return reply;
}