import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { Blog } from './Blog';

@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  // Hash password before saving to DB
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Generate unique username based on firstName and lastName
  @BeforeInsert()
  async generateUsername() {
    const userRepository = AppDataSource.getRepository(User);
    let baseUsername = `${this.firstName}-${this.lastName}`.toLowerCase();
    let username = baseUsername;
    let userExists = await userRepository.findOne({ where: { username } });

    let count = 1;

    while (userExists) {
      username = `${baseUsername}${count}`;
      userExists = await userRepository.findOne({ where: { username } });
      count++;
    }

    this.username = username;
  }
}
