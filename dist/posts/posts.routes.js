import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { postsController } from "./posts.controller.js";
import requireRole from "../middlewares/requireRole.js";
import auth from "../middlewares/auth.js";
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
router.get("/", postsController.getAll);
router.get("/:id", postsController.getOne);
router.post("/", createRules, validate, postsController.create);
router.patch("/:id", updateRules, validate, postsController.update);
router.delete("/:id", auth, requireRole("admin"), postsController.delete);
export default router;
