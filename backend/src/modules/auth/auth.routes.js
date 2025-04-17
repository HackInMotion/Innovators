import express from "express";
import {
  createUser,
  getProfile,
  getUserById,
  loginUser,
  protectedRoutes,
} from "./auth.controller.js";

const authRouter = express.Router();
authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile",protectedRoutes, getProfile);
authRouter.get("/:id", protectedRoutes, getUserById);

export default authRouter;
