import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { postsController } from "./posts.controller.js";
import requireRole from "../middlewares/requireRole.js";
import auth from "../middlewares/auth.js";
import { PostsService } from "./posts.service.js";
import { PostsRepository } from "./posts.model.js";
import { AppError } from "../errors/index.js";

const router = Router();
const postsService = new PostsService(new PostsRepository());

const createRules = [
  body("title")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Title min 3 chars"),
  body("content")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Content min 10 chars"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").isString().withMessage("Each tag must be a string"),
];

const updateRules = [
  body("title").optional().isString().isLength({ min: 3 }),
  body("content").optional().isString().isLength({ min: 10 }),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").isString().withMessage("Each tag must be a string"),
];

router.get("/", postsController.getAll);
router.get("/:id", postsController.getOne);
router.post("/", createRules, validate, postsController.create);
router.patch("/:id", updateRules, validate, postsController.update);
router.delete("/:id", auth, requireRole("admin"), postsController.delete);
router.post("/:id/publish", async (req, res, next) => {
  const result = await postsService.publishPost(Number(req.params.id));
  if (result.error) return next(new AppError(result.error, 400));
  res.json(result.data);
});

export default router;
