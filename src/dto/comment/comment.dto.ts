export class CreateCommentDTO {
  slug: string
  blogId?: string
  userId: string
  body: string
  image?: string
}

export class CreateReplyDTO {
  commentId?: string
  userId: string
  body: string
  image?: string
}