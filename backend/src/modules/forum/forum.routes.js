import express from "express";
import { createForum, getForumById, getForums } from "./forum.controller.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";

const forumRouter = express.Router();

forumRouter.post("/", protectedRoutes, allowedTo("admin"), createForum);

forumRouter.get("/", protectedRoutes, getForums);

forumRouter.get("/:id", protectedRoutes, getForumById);

export default forumRouter;
