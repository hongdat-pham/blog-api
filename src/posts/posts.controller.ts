import { PostsService } from "./posts.service.js";
import { Request, Response, NextFunction } from "express";

const service = new PostsService();

export const PostsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page, limit } = req.query;
      const result = await service.findAll({
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    const result = await service.findById(Number(req.params.id));
    if (result.error) {
      res.status(404).json({ error: result.error });
      return;
    }
    res.json(result.data);
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await service.create(req.body);
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const result = await service.update(Number(req.params.id), req.body);
    if (result.error) {
      res.status(404).json({ error: result.error });
      return;
    }
    res.json(result.data);
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await service.delete(Number(req.params.id));
    if (result.error) {
      res.status(404).json({ error: result.error });
      return;
    }
    res.status(204).send();
  },
};
