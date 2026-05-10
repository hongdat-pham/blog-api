import { PostsRepository } from "./posts.model.js";
import { Post } from "@prisma/client";
import { PaginatedResponse } from "../types/common.types.js";
import { NotFoundError, ConflictError } from "../errors/index.js";
import {
  CreatePostDto,
  UpdatePostDto,
  PostWithRelations,
  PostWithCount,
} from "../types/post.types.js";

interface FindAllParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface IPostsService {
  findAll(params: FindAllParams): Promise<PaginatedResponse<PostWithCount>>;
  findById(id: number): Promise<PostWithRelations>;
  create(body: CreatePostDto): Promise<Post>;
  update(id: number, body: UpdatePostDto): Promise<Post>;
  delete(id: number): Promise<void>;
}

export class PostsService implements IPostsService {
  constructor(private readonly repo: PostsRepository) {}

  async findAll({
    search,
    page = 1,
    limit = 10,
  }: FindAllParams): Promise<PaginatedResponse<PostWithCount>> {
    const { data, total } = await this.repo.findAll({ search, page, limit });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id: number): Promise<PostWithRelations> {
    const post = await this.repo.findById(id);
    if (!post) throw new NotFoundError("Post");
    return post;
  }

  async create(body: CreatePostDto): Promise<Post> {
    const existingPost = await this.repo.findByTitle(body.title);
    if (existingPost) throw new ConflictError("Post with this title");
    return this.repo.create(body);
  }

  async update(id: number, body: UpdatePostDto): Promise<Post> {
    await this.findById(id);
    const post = await this.repo.update(id, body);
    if (!post) throw new NotFoundError("Post");
    return post;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundError("Post");
  }
}
