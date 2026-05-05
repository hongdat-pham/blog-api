import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { CommentsController } from "./comments.controller.js";

const router = Router({ mergeParams: true });

const createRules = [
  body("author").isString().isLength({ min: 2 }).withMessage("Author required"),
  body("content")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Content min 5 chars"),
];

router.get("/", CommentsController.getAll);
router.post("/", createRules, validate, CommentsController.create);
router.delete("/:commentId", CommentsController.delete);

export default router;
