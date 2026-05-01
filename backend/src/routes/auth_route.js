import { Router } from "express";
import { AuthController } from "../controller/auth_controller.js";

const authController = new AuthController();
export const authRouter = Router();

authRouter.post("/signup", authController.signupUser.bind(authController));
authRouter.post("/login", authController.loginUser.bind(authController));
authRouter.post("/logout", authController.logoutUser.bind(authController));
