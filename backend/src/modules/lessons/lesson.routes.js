import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import {
  createLesson,
  deleteLesson,
  getLesson,
  updateLesson,
} from "./lesson.controller.js";

const lessonRouter = express.Router();

lessonRouter.get("/:lessonId", getLesson);
lessonRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  uploadSingleFile("video", "lessons"),
  createLesson
);

lessonRouter.put(
  "/:lessonId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  uploadSingleFile("video", "lessons"),
  updateLesson
);

lessonRouter.delete(
  "/:lessonId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  deleteLesson
);

export default lessonRouter;
