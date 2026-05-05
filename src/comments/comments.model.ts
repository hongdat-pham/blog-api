import { readData, writeData } from "../data/db.js";
import { Comment, CreateCommentDto } from "../types/comment.types.js";

const FILE = "comments.json";

export const CommentModel = {
  async findByPost(postId: number): Promise<Comment[]> {
    const all = await readData<Comment>(FILE);
    return all.filter((c) => c.postId === postId);
  },

  async create(postId: number, data: CreateCommentDto): Promise<Comment> {
    const all = await readData<Comment>(FILE);
    const comment: Comment = {
      id: Date.now(),
      postId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    all.push(comment);
    await writeData<Comment>(FILE, all);
    return comment;
  },

  async delete(postId: number, commentId: number): Promise<boolean> {
    const all = await readData<Comment>(FILE);
    const idx = all.findIndex((c) => c.id === commentId && c.postId === postId);
    if (idx === -1) return false;
    all.splice(idx, 1);
    await writeData<Comment>(FILE, all);
    return true;
  },
};
