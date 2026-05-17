import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { UsersRepository } from "../users/users.model.js";
import auth from "../middlewares/auth.js";

const usersRepo = new UsersRepository();
const authService = new AuthService(usersRepo);
const authController = new AuthController(authService);

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", auth, authController.me);
