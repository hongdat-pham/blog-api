import prisma from "../database/prisma.js";
import { PostWithCount } from "../types/post.types.js";

export class UsersRepository {
  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findPostsByUserId(userId: number): Promise<PostWithCount[]> {
    return prisma.post.findMany({
      where: { authorId: userId },
      include: {
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
    });
  }
}
