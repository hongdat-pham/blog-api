import { PostModel } from "../posts/posts.model.js";
import { CommentModel } from "./comments.model.js";
import { Comment, CreateCommentDto } from "../types/comment.types.js";
import { PaginatedResponse, ServiceResult } from "../types/common.types.js";
export class CommentsService {
  async findByPost(postId: number) {
    const post = await PostModel.findById(postId);
    if (!post) return { data: null, error: "Post not found" };
    return { data: await CommentModel.findByPost(postId), error: null };
  }

  async create(
    postId: number,
    body: CreateCommentDto,
  ): Promise<ServiceResult<Comment>> {
    const post = await PostModel.findById(postId);
    if (!post) return { data: null, error: "Post not found" };
    const comment = await CommentModel.create(postId, body);
    return { data: comment, error: null };
  }

  async delete(
    postId: number,
    commentId: number,
  ): Promise<ServiceResult<null>> {
    const deleted = await CommentModel.delete(postId, commentId);
    if (!deleted) return { data: null, error: "Comment not found" };
    return { data: null, error: null };
  }
}
