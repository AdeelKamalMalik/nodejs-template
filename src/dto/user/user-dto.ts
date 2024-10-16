
export class GenerateTokenDTO {
  jwt!: string;
  updated_at!: Date;
}

export class UserDTO {
  email!: string;
  firstName!: string;
  lastName!: string;
  avatar: string;
}

export class CreateUserDTO extends UserDTO {
  password!: string;
}

export class GetUserDTO extends UserDTO {
  id!: string;
}
