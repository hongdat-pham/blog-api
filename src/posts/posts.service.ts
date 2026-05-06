import { PostsRepository } from "./posts.model.js";
import { Post, CreatePostDto, UpdatePostDto } from "../types/post.types.js";
import { PaginatedResponse, ServiceResult } from "../types/common.types.js";

interface FindAllParams {
  search?: string;
  page?: number;
  limit?: number;
}
export interface IPostsService {
  findAll(params: FindAllParams): Promise<PaginatedResponse<Post>>;
  findById(id: number): Promise<ServiceResult<Post>>;
  create(body: CreatePostDto): Promise<Post>;
  update(id: number, body: UpdatePostDto): Promise<ServiceResult<Post>>;
  delete(id: number): Promise<ServiceResult<null>>;
}

export class PostsService implements IPostsService {
  constructor(private readonly repo: PostsRepository) {}

  async findAll({
    search,
    page = 1,
    limit = 10,
  }: FindAllParams): Promise<PaginatedResponse<Post>> {
    let posts = await this.repo.findAll();

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

  async findById(id: number): Promise<ServiceResult<Post>> {
    const post = await this.repo.findById(id); // gọi repo
    if (!post) return { data: null, error: "Post not found" };
    return { data: post, error: null };
  }

  async create(body: CreatePostDto): Promise<Post> {
    return this.repo.create(body); // gọi repo
  }

  async update(id: number, body: UpdatePostDto): Promise<ServiceResult<Post>> {
    const post = await this.repo.update(id, body); // gọi repo
    if (!post) return { data: null, error: "Post not found" };
    return { data: post, error: null };
  }

  async delete(id: number): Promise<ServiceResult<null>> {
    const deleted = await this.repo.delete(id); // gọi repo
    if (!deleted) return { data: null, error: "Post not found" };
    return { data: null, error: null };
  }
}
