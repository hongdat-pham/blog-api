import { Router } from "express";
import { usersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { UsersRepository } from "./users.model.js";
import { AppError } from "../errors/index.js";

const router = Router();
const usersService = new UsersService(new UsersRepository());

router.get("/:id/posts", usersController.getPostsByUser);
router.delete("/:id", async (req, res, next) => {
  const result = await usersService.deleteUser(Number(req.params.id));
  if (result.error) return next(new AppError(result.error, 404));
  res.status(204).send();
});

export default router;
