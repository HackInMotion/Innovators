import express from "express";
import {
  createSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory,
} from "./subcategory.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const subcategoryRouter = express.Router();

subcategoryRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("subcategoryImage", "subcategory"),
  createSubcategory
);
subcategoryRouter.get("/", getSubcategories);
subcategoryRouter.put(
  "/:subcategoryId",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("subcategoryImage", "subcategory"),
  updateSubcategory
);

subcategoryRouter.delete(
  "/:subcategoryId",
  protectedRoutes,
  allowedTo("admin"),
  deleteSubcategory
);

export default subcategoryRouter;
