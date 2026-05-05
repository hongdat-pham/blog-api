import config from "../config.js";

export function auth(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== config.apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
