import { NotFoundError } from "../errors/index.js";
export class CommentsService {
    postsRepo;
    commentsRepo;
    constructor(postsRepo, commentsRepo) {
        this.postsRepo = postsRepo;
        this.commentsRepo = commentsRepo;
    }
    async findByPost(postId) {
        const post = await this.postsRepo.findById(postId);
        if (!post)
            throw new NotFoundError("Post");
        return this.commentsRepo.findByPost(postId);
    }
    async create(postId, body) {
        const post = await this.postsRepo.findById(postId);
        if (!post)
            throw new NotFoundError("Post");
        return this.commentsRepo.create(postId, body);
    }
    async delete(postId, commentId) {
        const deleted = await this.commentsRepo.delete(postId, commentId);
        if (!deleted)
            throw new NotFoundError("Comment");
    }
}
