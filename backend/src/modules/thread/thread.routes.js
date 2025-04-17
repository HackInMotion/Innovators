import express from "express";
import {
  createThread,
  getThreadById,
  getThreadsByForum,
} from "./thread.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const threadRouter = express.Router();

threadRouter.post("/", protectedRoutes, createThread);
threadRouter.get("/:forumId", protectedRoutes, getThreadsByForum);
threadRouter.get("/:id", protectedRoutes, getThreadById);

export default threadRouter;
