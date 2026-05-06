import { CommentsService } from "./comments.service.js";
import { Request, Response, NextFunction } from "express";

const service = new CommentsService();

export const CommentsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.findByPost(Number(req.params.postId));
      if (result.error) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.json(result.data);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.create(Number(req.params.postId), req.body);
      if (result.error) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.status(201).json(result.data);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await service.delete(
      Number(req.params.postId),
      Number(req.params.commentId),
    );
    if (result.error) {
      res.status(404).json({ error: result.error });
      return;
    }
    res.status(204).send();
  },
};
