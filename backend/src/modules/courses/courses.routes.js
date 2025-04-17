import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  updateCourse,
} from "./courses.controller.js";

const courseRouter = express.Router();

courseRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  uploadSingleFile("coverImage", "course"),
  createCourse
);
courseRouter.get("/", getAllCourses);
courseRouter.get("/category", getCoursesByCategory);
courseRouter.get("/:id", getCourseById);
courseRouter.put(
  "/:courseId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  uploadSingleFile("coverImage", "course"),
  updateCourse
);
courseRouter.delete(
  "/:courseId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  deleteCourse
);

export default courseRouter;