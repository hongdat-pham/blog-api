import { ErrorRequestHandler } from "express";
import AppError from "../errors/AppError.js";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
