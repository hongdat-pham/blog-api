import { readData, writeData } from "../data/db.js";

const FILE = "posts.json";

export const PostModel = {
  async findAll() {
    return readData(FILE);
  },

  async findById(id) {
    const posts = await readData(FILE);
    return posts.find((p) => p.id === id) || null;
  },

  async create(data) {
    const posts = await readData(FILE);
    const newPost = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    await writeData(FILE, posts);
    return newPost;
  },

  async update(id, data) {
    const posts = await readData(FILE);
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    posts[idx] = {
      ...posts[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await writeData(FILE, posts);
    return posts[idx];
  },

  async delete(id) {
    const posts = await readData(FILE);
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    posts.splice(idx, 1);
    await writeData(FILE, posts);
    return true;
  },
};
