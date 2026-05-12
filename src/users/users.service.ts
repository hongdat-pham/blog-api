import { UsersRepository } from "./users.model.js";
import { PostWithCount } from "../types/post.types.js";
import { NotFoundError } from "../errors/index.js";
import { ServiceResult } from "../types/common.types.js";
import prisma from "../database/prisma.js";

export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getPostsByUser(userId: number): Promise<PostWithCount[]> {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundError("User");

    return this.repo.findPostsByUserId(userId);
  }
  async deleteUser(id: number): Promise<ServiceResult<null>> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { data: null, error: "User not found" };
    }

    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: { post: { authorId: id } },
      }),

      prisma.post.deleteMany({ where: { authorId: id } }),

      prisma.user.delete({ where: { id } }),
    ]);
    return { data: null, error: null };
  }
}
