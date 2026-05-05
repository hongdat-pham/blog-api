import { PostModel } from "./posts.model.js";
import { AppError } from "../errors/AppError.js";

export class PostsService {
  async findAll({ search, page = 1, limit = 10 }) {
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

  async findById(id) {
    const post = await PostModel.findById(Number(id));
    if (!post) throw new AppError("Post not found", 404);
    return post;
  }

  async create(body) {
    return PostModel.create(body);
  }

  async update(id, body) {
    const post = await PostModel.update(Number(id), body);
    if (!post) throw new AppError("Post not found", 404);
    return post;
  }

  async delete(id) {
    const deleted = await PostModel.delete(Number(id));
    if (!deleted) throw new AppError("Post not found", 404);
  }
}
