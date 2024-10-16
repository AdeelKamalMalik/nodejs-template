import { Blog } from '../../entity/Blog';
import { BlogDTO, GetBlogDTO } from './blog-dto';

export function createBlogMapper(blogDTO: BlogDTO): Blog {
  const blog = new Blog();

  blog.title = blogDTO.title;
  blog.image = blogDTO.image;
  blog.body = blogDTO.body;

  return blog;
}

export function blogMapper(blog: Blog): GetBlogDTO {
  const blogDTO = new GetBlogDTO();

  blogDTO.id = blog.id;
  blogDTO.slug = blog.slug;
  blogDTO.title = blog.title;
  blogDTO.image = blog.image;
  blogDTO.views = blog.views;

  return blogDTO;
}
