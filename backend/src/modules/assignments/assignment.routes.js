import express from "express";
import {
  createAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} from "./assignment.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const assignmentRouter = express.Router();

assignmentRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  uploadSingleFile("assignmentPaper", "assignments"),
  createAssignment
);

assignmentRouter.get("/:assignmentId", getAssignment);

assignmentRouter.put(
  "/:assignmentId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  uploadSingleFile("assignmentPaper", "assignments"),
  updateAssignment
);

assignmentRouter.delete(
  "/:assignmentId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  deleteAssignment
);

export default assignmentRouter;
