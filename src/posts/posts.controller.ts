import { Request, Response, NextFunction } from "express";
import { PostsRepository } from "./posts.model.js";
import { PostsService, IPostsService } from "./posts.service.js";

const repo = new PostsRepository();
const service: IPostsService = new PostsService(repo);
export class PostsController {
  constructor(private readonly service: IPostsService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;
      const result = await this.service.findAll({
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findById(Number(req.params.id));
      if (result.error) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json(result.data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.service.create(req.body);
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(Number(req.params.id), req.body);
      if (result.error) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json(result.data);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.delete(Number(req.params.id));
      if (result.error) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

export const postsController = new PostsController(service);
