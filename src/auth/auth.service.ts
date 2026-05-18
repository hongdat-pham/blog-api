import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UsersRepository } from "../users/users.model.js";
import { RegisterDto, LoginDto, PublicUser } from "../types/user.types.js";
import { ServiceResult } from "../types/common.types.js";
import config from "../config.js";
import prisma from "../database/prisma.js";

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
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

  private signAccessToken(userId: string, role: string): string {
    return jwt.sign({ sub: userId, role }, config.jwtSecret, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  private async saveRefreshToken(userId: number, token: string): Promise<void> {
    const hashedToken = await bcrypt.hash(token, SALT_ROUNDS);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    await prisma.refreshToken.create({
      data: { token: hashedToken, userId, expiresAt },
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
    return {
      data: { ...rest, role: rest.role as "user" | "admin" },
      error: null,
    };
  }

  async login(dto: LoginDto): Promise<ServiceResult<AuthTokens>> {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) {
      return { data: null, error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      return { data: null, error: "Invalid email or password" };
    }

    const accessToken = this.signAccessToken(String(user.id), user.role);
    const refreshToken = this.generateRefreshToken();

    await this.saveRefreshToken(user.id, refreshToken);

    return { data: { accessToken, refreshToken }, error: null };
  }

  async refresh(token: string): Promise<ServiceResult<AuthTokens>> {
    const storedTokens = await prisma.refreshToken.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    let matchedToken = null;
    for (const stored of storedTokens) {
      const isMatch = await bcrypt.compare(token, stored.token);
      if (isMatch) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      return { data: null, error: "Invalid or expired refresh token" };
    }

    if (matchedToken.status === "used") {
      await prisma.refreshToken.deleteMany({
        where: { userId: matchedToken.userId },
      });
      return {
        data: null,
        error: "Token has been used already. All sessions terminated.",
      };
    }

    await prisma.refreshToken.update({
      where: { id: matchedToken.id },
      data: { status: "used" },
    });

    const user = matchedToken.user;
    const newAccessToken = this.signAccessToken(String(user.id), user.role);
    const newRefreshToken = this.generateRefreshToken();
    await this.saveRefreshToken(user.id, newRefreshToken);

    return {
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      error: null,
    };
  }

  async logout(token: string): Promise<ServiceResult<null>> {
    const storedTokens = await prisma.refreshToken.findMany();

    let matchedToken = null;
    for (const stored of storedTokens) {
      const isMatch = await bcrypt.compare(token, stored.token);
      if (isMatch) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      return { data: null, error: "Invalid refresh token" };
    }

    await prisma.refreshToken.delete({ where: { id: matchedToken.id } });
    return { data: null, error: null };
  }

  async getMe(userId: number): Promise<ServiceResult<PublicUser>> {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      return { data: null, error: "User not found" };
    }

    const { password: _, ...rest } = user;
    return {
      data: { ...rest, role: rest.role as "user" | "admin" },
      error: null,
    };
  }
}
