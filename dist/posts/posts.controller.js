import { PostsRepository } from "./posts.model.js";
import { PostsService } from "./posts.service.js";
const repo = new PostsRepository();
const service = new PostsService(repo);
export class PostsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const { search, page, limit } = req.query;
            const result = await this.service.findAll({
                search: search,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    };
    getOne = async (req, res, next) => {
        try {
            const post = await this.service.findById(Number(req.params.id));
            res.json(post);
        }
        catch (err) {
            next(err);
        }
    };
    create = async (req, res, next) => {
        try {
            const post = await this.service.create(req.body);
            res.status(201).json(post);
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const post = await this.service.update(Number(req.params.id), req.body);
            res.json(post);
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.delete(Number(req.params.id));
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    };
}
export const postsController = new PostsController(service);
