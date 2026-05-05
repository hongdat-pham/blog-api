import { CommentModel } from "./comments.model.js";
import { PostModel } from "../posts/posts.model.js";
import { AppError } from "../errors/AppError.js";

export class CommentsService {
  async findByPost(postId) {
    const post = await PostModel.findById(Number(postId));
    if (!post) throw new AppError("Post not found", 404);
    return CommentModel.findByPost(Number(postId));
  }

  async create(postId, body) {
    const post = await PostModel.findById(Number(postId));
    if (!post) throw new AppError("Post not found", 404);
    return CommentModel.create(Number(postId), body);
  }

  async delete(postId, commentId) {
    const deleted = await CommentModel.delete(
      Number(postId),
      Number(commentId),
    );
    if (!deleted) throw new AppError("Comment not found", 404);
  }
}
