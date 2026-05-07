import { PostsRepository } from "../posts/posts.model.js";
import { CommentsRepository } from "./comments.model.js";
import { Comment, CreateCommentDto } from "../types/comment.types.js";
import { NotFoundError } from "../errors/index.js";

export interface ICommentsService {
  findByPost(postId: number): Promise<Comment[]>;
  create(postId: number, body: CreateCommentDto): Promise<Comment>;
  delete(postId: number, commentId: number): Promise<void>;
}

export class CommentsService implements ICommentsService {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
  ) {}

  async findByPost(postId: number): Promise<Comment[]> {
    const post = await this.postsRepo.findById(postId);
    if (!post) throw new NotFoundError("Post");
    return this.commentsRepo.findByPost(postId);
  }

  async create(postId: number, body: CreateCommentDto): Promise<Comment> {
    const post = await this.postsRepo.findById(postId);
    if (!post) throw new NotFoundError("Post");
    return this.commentsRepo.create(postId, body);
  }

  async delete(postId: number, commentId: number): Promise<void> {
    const deleted = await this.commentsRepo.delete(postId, commentId);
    if (!deleted) throw new NotFoundError("Comment");
  }
}
