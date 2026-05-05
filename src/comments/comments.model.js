import { readData, writeData } from "../data/db.js";

const FILE = "comments.json";

export const CommentModel = {
  async findByPost(postId) {
    const all = await readData(FILE);
    return all.filter((c) => c.postId === postId);
  },

  async create(postId, data) {
    const all = await readData(FILE);
    const comment = {
      id: Date.now(),
      postId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    all.push(comment);
    await writeData(FILE, all);
    return comment;
  },

  async delete(postId, commentId) {
    const all = await readData(FILE);
    const idx = all.findIndex((c) => c.id === commentId && c.postId === postId);
    if (idx === -1) return false;
    all.splice(idx, 1);
    await writeData(FILE, all);
    return true;
  },
};
