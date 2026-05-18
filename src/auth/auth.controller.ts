import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res
          .status(400)
          .json({ error: "name, email, and password are required" });
        return;
      }
      const result = await this.authService.register({ name, email, password });
      if (result.error) {
        res.status(409).json({ error: result.error });
        return;
      }
      res.status(201).json({ data: result.data });
    } catch (err) {
      next(err);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }
      const result = await this.authService.login({ email, password });
      if (result.error) {
        res.status(401).json({ error: result.error });
        return;
      }
      res.status(200).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: "refreshToken is required" });
        return;
      }
      const result = await this.authService.refresh(refreshToken);
      if (result.error) {
        res.status(401).json({ error: result.error });
        return;
      }
      res.status(200).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: "refreshToken is required" });
        return;
      }
      const result = await this.authService.logout(refreshToken);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const result = await this.authService.getMe(userId);
      if (result.error) {
        res.status(404).json({ error: result.error });
        return;
      }
      res.status(200).json({ data: result.data });
    } catch (err) {
      next(err);
    }
  };
}
