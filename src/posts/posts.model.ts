import prisma from "../database/prisma.js";
import { Post, Comment, User } from "@prisma/client";
import { PostWithRelations, PostWithCount } from "../types/post.types.js";

export class PostsRepository {
  async findAll({
    search,
    page = 1,
    limit = 10,
  }: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PostWithCount[]; total: number }> {
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { comments: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<PostWithRelations | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async findByTitle(title: string): Promise<Post | null> {
    return prisma.post.findFirst({
      where: { title },
    });
  }

  async create(data: {
    title: string;
    content: string;
    authorId: number;
    tags?: string[];
  }): Promise<Post> {
    return prisma.post.create({ data });
  }

  async update(
    id: number,
    data: Partial<{
      title: string;
      content: string;
      tags: string[];
    }>,
  ): Promise<Post | null> {
    const exists = await prisma.post.findUnique({ where: { id } });
    if (!exists) return null;

    return prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    const exists = await prisma.post.findUnique({ where: { id } });
    if (!exists) return false;

    await prisma.post.delete({ where: { id } });
    return true;
  }
}
