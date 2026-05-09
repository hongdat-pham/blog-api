import prisma from "../database/prisma.js";
import { Comment } from "@prisma/client";

export class CommentsRepository {
  async findByPost(postId: number): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
    });
  }

  async create(postId: number, data: { content: string }): Promise<Comment> {
    return prisma.comment.create({
      data: {
        content: data.content,
        postId,
      },
    });
  }

  async delete(postId: number, commentId: number): Promise<boolean> {
    const exists = await prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
      },
    });
    if (!exists) return false;

    await prisma.comment.delete({ where: { id: commentId } });
    return true;
  }
}
