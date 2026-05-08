import { NotFoundError, ConflictError } from "../errors/index.js";
export class PostsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll({ search, page = 1, limit = 10, }) {
        let posts = await this.repo.findAll();
        if (search) {
            const kw = search.toLowerCase();
            posts = posts.filter((p) => p.title.toLowerCase().includes(kw) ||
                p.content.toLowerCase().includes(kw));
        }
        const total = posts.length;
        const start = (page - 1) * limit;
        const data = posts.slice(start, start + limit);
        return { data, total, page: Number(page), limit: Number(limit) };
    }
    async findById(id) {
        const post = await this.repo.findById(id);
        if (!post)
            throw new NotFoundError("Post");
        return post;
    }
    async create(body) {
        const existingPost = await this.repo.findByTitle(body.title);
        if (existingPost) {
            throw new ConflictError("Post with this title");
        }
        return this.repo.create(body);
    }
    async update(id, body) {
        await this.findById(id);
        const post = await this.repo.update(id, body);
        if (!post)
            throw new NotFoundError("Post");
        return post;
    }
    async delete(id) {
        const deleted = await this.repo.delete(id);
        if (!deleted)
            throw new NotFoundError("Post");
    }
}
