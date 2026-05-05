import express from "express";
import { logger } from "./middlewares/logger.js";
import { auth } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import postsRouter from "./posts/posts.routes.js";
import commentsRouter from "./comments/comments.routes.js";

const app = express();

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({
    name: "Blog API",
    version: "1.0.0",
    endpoints: ["/posts", "/posts/:id/comments"],
  });
});

app.use("/posts", auth, postsRouter);
app.use("/posts/:postId/comments", auth, commentsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.url });
});

app.use(errorHandler);

export default app;
