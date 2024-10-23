import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate, Unique, OneToMany } from 'typeorm';
import { User } from './User';
import { AppDataSource } from '../data-source';
import { Comment } from './Comment';

@Entity('blogs')
@Unique(['slug'])
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  body: string;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  async generateSlug() {
    if (!this.slug) {
      const blogRepository = AppDataSource.getRepository(Blog);

      let baseSlug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if the slug already exists
      let slug = baseSlug;
      let existingBlog = await blogRepository.findOne({ where: { slug } });

      if (existingBlog) {
        let counter = 1;
        let newSlug = `${baseSlug}-${counter}`;
        while (await blogRepository.findOne({ where: { slug: newSlug } })) {
          counter += 1;
          newSlug = `${baseSlug}-${counter}`;
        }
        slug = newSlug;
      }

      this.slug = slug;
    }
  }
}
