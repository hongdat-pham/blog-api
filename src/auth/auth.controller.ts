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

      res.status(200).json({ data: result.data });
    } catch (err) {
      next(err);
    }
  };
}
