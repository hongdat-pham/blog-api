import { Request, Response, NextFunction } from "express";
import { UsersRepository } from "./users.model.js";
import { UsersService } from "./users.service.js";

const repo = new UsersRepository();
const service = new UsersService(repo);

export class UsersController {
  constructor(private readonly service: UsersService) {}

  getPostsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.service.getPostsByUser(Number(req.params.id));
      res.json(posts);
    } catch (err) {
      next(err);
    }
  };
}

export const usersController = new UsersController(service);
