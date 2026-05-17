import bcrypt from "bcrypt";
import { UsersRepository } from "../users/users.model.js";
import { RegisterDto, LoginDto, PublicUser } from "../types/user.types.js";
import { ServiceResult } from "../types/common.types.js";

const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async register(dto: RegisterDto): Promise<ServiceResult<PublicUser>> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) {
      return { data: null, error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const created = await this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const { password: _, ...publicUser } = created;
    return { data: publicUser, error: null };
  }

  async login(dto: LoginDto): Promise<ServiceResult<PublicUser>> {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) {
      return { data: null, error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      return { data: null, error: "Invalid email or password" };
    }

    const { password: _, ...publicUser } = user;
    return { data: publicUser, error: null };
  }
}
