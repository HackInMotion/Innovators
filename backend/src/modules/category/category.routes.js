import express from "express";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("categoryImage", "category"),
  createCategory
);
categoryRouter.get("/", getCategories);
categoryRouter.put(
  "/:categoryId",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("categoryImage", "category"),
  updateCategory
);
categoryRouter.delete(
  "/:categoryId",
  protectedRoutes,
  allowedTo("admin"),
  deleteCategory
);

export default categoryRouter;
