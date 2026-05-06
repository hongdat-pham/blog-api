import { RequestHandler } from "express";

const requireRole = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden — required roles: ${roles.join(", ")}`,
      });
      return;
    }

    next();
  };
};

export default requireRole;
