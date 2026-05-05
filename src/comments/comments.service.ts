import { CommentModel } from "./comments.model.js";
import { PostModel } from "../posts/posts.model.js";
import { AppError } from "../errors/AppError.js";
import { CreateCommentDto } from "../types/comment.types.js";

export class CommentsService {
  async findByPost(postId: number) {
    const post = await PostModel.findById(postId);
    if (!post) throw new AppError("Post not found", 404);
    return CommentModel.findByPost(postId);
  }

  async create(postId: number, body: CreateCommentDto) {
    const post = await PostModel.findById(postId);
    if (!post) throw new AppError("Post not found", 404);
    return CommentModel.create(postId, body);
  }

  async delete(postId: number, commentId: number): Promise<void> {
    const deleted = await CommentModel.delete(postId, commentId);
    if (!deleted) throw new AppError("Comment not found", 404);
  }
}
