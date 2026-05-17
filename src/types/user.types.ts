export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export type PublicUser = Omit<User, "password">;
