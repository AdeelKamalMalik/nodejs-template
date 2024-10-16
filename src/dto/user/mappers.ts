import { User } from '../../entity/User';
import { CreateUserDTO, GenerateTokenDTO, GetUserDTO, UserDTO } from './user-dto';

export function createUserMapper(createUserDTO: CreateUserDTO): User {
  const user = new User();

  user.email = createUserDTO.email;
  user.password = createUserDTO.password;
  user.firstName = createUserDTO.firstName;
  user.lastName = createUserDTO.lastName;
  user.avatar = createUserDTO.avatar;

  return user;
}

export function userMapper(user: User): GetUserDTO {
  const userDTO = new GetUserDTO();

  userDTO.id = user.id;
  userDTO.firstName = user.firstName;
  userDTO.lastName = user.lastName;
  userDTO.email = user.email;
  userDTO.avatar = user.avatar;

  return userDTO;
}

export function generateTokenMapper(token: string, user: User): GenerateTokenDTO{
  const tokenDTO = new GenerateTokenDTO()
  tokenDTO.jwt = token;
  tokenDTO.updated_at = user.updated_at;

  return tokenDTO
}
