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
    try {
      const post = await service.findById(Number(req.params.id));
      res.json(post);
    } catch (err) {
      next(err);
    }
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
    try {
      const post = await service.update(Number(req.params.id), req.body);
      res.json(post);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
