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
