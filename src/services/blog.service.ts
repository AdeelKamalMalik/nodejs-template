import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Blog } from '../entity/Blog';
import { User } from '../entity/User';
import { BlogDTO } from '../dto/blog/blog-dto';

export class BlogService {
  private blogRepository: Repository<Blog>;
  private userRepository: Repository<User>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      AppDataSource.initialize().then(() => {
        this.userRepository = AppDataSource.getRepository(User);
      }).catch(error => {
        console.error('Error during Data Source initialization:', error);
      });
    } else {
      this.blogRepository = AppDataSource.getRepository(Blog);
      this.userRepository = AppDataSource.getRepository(User);
    } 
  }

  async createBlog(payload: BlogDTO): Promise<Blog> {
    const { body, image, title, userId} = payload
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    const blog = this.blogRepository.create({ title, body, user, image });
    return await this.blogRepository.save(blog);
  }

  async updateBlog(id: string, updates: Partial<Blog>): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new Error('Blog not found');

    Object.assign(blog, updates);
    return await this.blogRepository.save(blog);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogRepository.find();
  }

  async getSingleBlog(slug: string): Promise<Blog | null> {
    return await this.blogRepository.findOneBy({ slug });
  }

  async incrementBlogViews(slug: string): Promise<Blog | null> {
    const blog = await this.getSingleBlog(slug);
    if (!blog) throw new Error('Blog not found');
    
    blog.views += 1;
    return await this.blogRepository.save(blog);
  }
}
