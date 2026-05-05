import { readData, writeData } from "../data/db.js";
import { Post } from "../types/post.types.js";

const FILE = "posts.json";

export const PostModel = {
  async findAll(): Promise<Post[]> {
    return readData<Post>(FILE);
  },

  async findById(id: number): Promise<Post | null> {
    const posts = await readData<Post>(FILE);
    return posts.find((p) => p.id === id) || null;
  },

  async create(
    data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  ): Promise<Post> {
    const posts = await readData<Post>(FILE);
    const newPost: Post = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    await writeData<Post>(FILE, posts);
    return newPost;
  },

  async update(id: number, data: Partial<Post>): Promise<Post | null> {
    const posts = await readData<Post>(FILE);
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    posts[idx] = {
      ...posts[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await writeData<Post>(FILE, posts);
    return posts[idx];
  },

  async delete(id: number): Promise<boolean> {
    const posts = await readData<Post>(FILE);
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    posts.splice(idx, 1);
    await writeData<Post>(FILE, posts);
    return true;
  },
};
