import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createModule, deleteModule, getModuleById, getModulesByCourse, updateModule } from "./module.controller.js";

const moduleRouter = express.Router();

moduleRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  createModule
);
moduleRouter.get("/course/:courseId", getModulesByCourse);
moduleRouter.get("/:moduleId", getModuleById);
moduleRouter.put(
  "/:moduleId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  updateModule
);
moduleRouter.delete(
  "/:moduleId",
  protectedRoutes,
  allowedTo("admin", "instructor"),
  deleteModule
);

export default moduleRouter;
