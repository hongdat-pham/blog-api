import { Request, Response, NextFunction } from "express";
import { PostsRepository } from "../posts/posts.model.js";
import { CommentsRepository } from "./comments.model.js";
import { CommentsService, ICommentsService } from "./comments.service.js";

// Nối dây từ dưới lên trên
const postsRepo = new PostsRepository();
const commentsRepo = new CommentsRepository();
const service: ICommentsService = new CommentsService(postsRepo, commentsRepo);

export class CommentsController {
  constructor(private readonly service: ICommentsService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findByPost(Number(req.params.postId));
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
      const result = await this.service.create(
        Number(req.params.postId),
        req.body,
      );
      if (result.error) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.status(201).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.delete(
        Number(req.params.postId),
        Number(req.params.commentId),
      );
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

export const commentsController = new CommentsController(service);
