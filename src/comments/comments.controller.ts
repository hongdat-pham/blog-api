import { CommentsService } from "./comments.service.js";
import { Request, Response, NextFunction } from "express";

const service = new CommentsService();

export const CommentsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await service.findByPost(Number(req.params.postId));
      res.json(comments);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await service.create(Number(req.params.postId), req.body);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(
        Number(req.params.postId),
        Number(req.params.commentId),
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
