import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { PostsController } from "./posts.controller.js";

const router = Router();

const createRules = [
  body("title")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Title min 3 chars"),
  body("content")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Content min 10 chars"),
];

const updateRules = [
  body("title").optional().isString().isLength({ min: 3 }),
  body("content").optional().isString().isLength({ min: 10 }),
];

router.get("/", PostsController.getAll);
router.get("/:id", PostsController.getOne);
router.post("/", createRules, validate, PostsController.create);
router.patch("/:id", updateRules, validate, PostsController.update);
router.delete("/:id", PostsController.delete);

export default router;
