import { UsersRepository } from "./users.model.js";
import { PostWithCount } from "../types/post.types.js";
import { NotFoundError } from "../errors/index.js";

export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getPostsByUser(userId: number): Promise<PostWithCount[]> {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundError("User");

    return this.repo.findPostsByUserId(userId);
  }
}
