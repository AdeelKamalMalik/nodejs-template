import { User } from "../../entity/User";

export class BlogDTO {
  title!: string
  body!: string
  image!: string
  userId!: string
}

export class GetBlogDTO extends BlogDTO {
  id!: string;
  slug!: string;
  views!: number
}

export class GetBlogsResponseDTO  {
  comments: number
  views!: number
  title!: string
  body!: string
  image!: string
  user!: User
}