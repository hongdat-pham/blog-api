import { PostModel } from "./posts.model.js";
import { AppError } from "../errors/AppError.js";
import { Post } from "../types/post.types.js";
import { PaginatedResponse } from "../types/common.types.js";

interface FindAllParams {
  search?: string;
  page?: number;
  limit?: number;
}

export class PostsService {
  async findAll({
    search,
    page = 1,
    limit = 10,
  }: FindAllParams): Promise<PaginatedResponse<Post>> {
    let posts = await PostModel.findAll();

    if (search) {
      const kw = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.content.toLowerCase().includes(kw),
      );
    }

    const total = posts.length;
    const start = (page - 1) * limit;
    const data = posts.slice(start, start + limit);

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id: number): Promise<Post> {
    const post = await PostModel.findById(id);
    if (!post) throw new AppError("Post not found", 404);
    return post;
  }

  async create(
    body: Omit<Post, "id" | "createdAt" | "updatedAt">,
  ): Promise<Post> {
    return PostModel.create(body);
  }

  async update(id: number, body: Partial<Post>): Promise<Post> {
    const post = await PostModel.update(id, body);
    if (!post) throw new AppError("Post not found", 404);
    return post;
  }

  async delete(id: number): Promise<void> {
    const deleted = await PostModel.delete(id);
    if (!deleted) throw new AppError("Post not found", 404);
  }
}
