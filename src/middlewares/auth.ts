import { RequestHandler } from "express";
import config from "../config.js";

const auth: RequestHandler = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || (apiKey !== config.apiKey && apiKey !== config.adminKey)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.user = {
    id: "system",
    role: apiKey === config.adminKey ? "admin" : "user",
  };

  next();
};

export default auth;
