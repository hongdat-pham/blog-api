import { PostsRepository } from "../posts/posts.model.js";
import { CommentsRepository } from "./comments.model.js";
import { CommentsService } from "./comments.service.js";
const postsRepo = new PostsRepository();
const commentsRepo = new CommentsRepository();
const service = new CommentsService(postsRepo, commentsRepo);
export class CommentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const comments = await this.service.findByPost(Number(req.params.postId));
            res.json(comments);
        }
        catch (err) {
            next(err);
        }
    };
    create = async (req, res, next) => {
        try {
            const comment = await this.service.create(Number(req.params.postId), req.body);
            res.status(201).json(comment);
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.delete(Number(req.params.postId), Number(req.params.commentId));
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    };
}
export const commentsController = new CommentsController(service);
