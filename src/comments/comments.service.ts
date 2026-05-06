import { PostsRepository } from "../posts/posts.model.js";
import { CommentsRepository } from "./comments.model.js";
import { Comment, CreateCommentDto } from "../types/comment.types.js";
import { ServiceResult } from "../types/common.types.js";

export interface ICommentsService {
  findByPost(postId: number): Promise<ServiceResult<Comment[]>>;
  create(
    postId: number,
    body: CreateCommentDto,
  ): Promise<ServiceResult<Comment>>;
  delete(postId: number, commentId: number): Promise<ServiceResult<null>>;
}

export class CommentsService implements ICommentsService {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
  ) {}

  async findByPost(postId: number): Promise<ServiceResult<Comment[]>> {
    const post = await this.postsRepo.findById(postId);
    if (!post) return { data: null, error: "Post not found" };
    const comments = await this.commentsRepo.findByPost(postId);
    return { data: comments, error: null };
  }

  async create(
    postId: number,
    body: CreateCommentDto,
  ): Promise<ServiceResult<Comment>> {
    const post = await this.postsRepo.findById(postId);
    if (!post) return { data: null, error: "Post not found" };
    const comment = await this.commentsRepo.create(postId, body);
    return { data: comment, error: null };
  }

  async delete(
    postId: number,
    commentId: number,
  ): Promise<ServiceResult<null>> {
    const deleted = await this.commentsRepo.delete(postId, commentId);
    if (!deleted) return { data: null, error: "Comment not found" };
    return { data: null, error: null };
  }
}
