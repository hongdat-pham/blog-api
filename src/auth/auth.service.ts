import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersRepository } from "../users/users.model.js";
import { RegisterDto, LoginDto, PublicUser } from "../types/user.types.js";
import { ServiceResult } from "../types/common.types.js";
import config from "../config.js";

const SALT_ROUNDS = 10;

interface AuthTokens {
  accessToken: string;
}

export class AuthService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private validatePasswordStrength(password: string): {
    isValid: boolean;
    message?: string;
  } {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/\d/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one digit",
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    return { isValid: true };
  }

  private signToken(userId: string, role: string): string {
    return jwt.sign({ sub: userId, role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  async register(dto: RegisterDto): Promise<ServiceResult<PublicUser>> {
    const passwordValidation = this.validatePasswordStrength(dto.password);
    if (!passwordValidation.isValid) {
      return {
        data: null,
        error: passwordValidation.message ?? "Invalid password",
      };
    }

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

    const { password: _, ...rest } = created;
    const publicUser: PublicUser = {
      ...rest,
      role: rest.role as "user" | "admin",
    };
    return { data: publicUser, error: null };
  }

  // login giờ trả về AccessToken thay vì PublicUser
  async login(dto: LoginDto): Promise<ServiceResult<AuthTokens>> {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) {
      return { data: null, error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      return { data: null, error: "Invalid email or password" };
    }

    const accessToken = this.signToken(String(user.id), user.role);
    return { data: { accessToken }, error: null };
  }
}
