import express from "express";
import {
  createDiscussion,
  getDiscussionsByForum,
  updateDiscussion,
  deleteDiscussion,
} from "./discussion.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";

const discussionsRouter = express.Router();

discussionsRouter
  .route("/")
  .post(protectedRoutes, uploadSingleFile("image", "forum"), createDiscussion);
discussionsRouter.route("/forum/:forumId").get(getDiscussionsByForum);
discussionsRouter
  .route("/:id")
  .put(protectedRoutes, uploadSingleFile("image", "forum"), updateDiscussion)
  .delete(protectedRoutes, deleteDiscussion);

export default discussionsRouter;
