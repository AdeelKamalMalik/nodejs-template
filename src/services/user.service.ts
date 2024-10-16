import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { userMapper, createUserMapper, generateTokenMapper } from '../dto/user/mappers';
import { CreateUserDTO, UserDTO, GenerateTokenDTO } from '../dto/user/user-dto';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      AppDataSource.initialize().then(() => {
        this.userRepository = AppDataSource.getRepository(User);
      }).catch(error => {
        console.error('Error during Data Source initialization:', error);
      });
    } else {
      this.userRepository = AppDataSource.getRepository(User);
    }
  }

  async getAll() {
    try {
      const users = await this.userRepository.find()

      const allUsers = users.map(user => userMapper(user))
      return allUsers
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async createUser(payload: CreateUserDTO): Promise<UserDTO> {
    try {
      const user = createUserMapper(payload);

      const savedUser = this.userRepository.create(user);
      await this.userRepository.manager.save(savedUser)

      return userMapper(savedUser);
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  generateJWT(user: User): GenerateTokenDTO {
    const payload = {
      id: user.id,
      email: user.email,
      updatedAt: user.updated_at,
    };

    return generateTokenMapper(jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' }), user);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
