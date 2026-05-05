import { CommentsService } from "./comments.service.js";

const service = new CommentsService();

export const CommentsController = {
  async getAll(req, res, next) {
    try {
      const comments = await service.findByPost(req.params.postId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const comment = await service.create(req.params.postId, req.body);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await service.delete(req.params.postId, req.params.commentId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
