import express from "express";
import {
  createUser,
  getUserById,
  loginUser,
  protectedRoutes,
} from "./auth.controller.js";

const authRouter = express.Router();
authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.get("/:id", protectedRoutes, getUserById);

export default authRouter;
