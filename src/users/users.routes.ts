import { Router } from "express";
import { usersController } from "./users.controller.js";

const router = Router();

router.get("/:id/posts", usersController.getPostsByUser);

export default router;
