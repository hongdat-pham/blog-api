import { PostsService } from "./posts.service.js";

const service = new PostsService();

export const PostsController = {
  async getAll(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const result = await service.findAll({ search, page, limit });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const post = await service.findById(req.params.id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const post = await service.create(req.body);
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const post = await service.update(req.params.id, req.body);
      res.json(post);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
