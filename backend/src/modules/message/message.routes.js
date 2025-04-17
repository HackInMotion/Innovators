import express from "express";
import {
  createMessage,
  getMessagesByThread,
  deleteMessage,
} from "./message.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";
const router = express.Router();

router.post("/", protectedRoutes, createMessage);

router.get("/:threadId", protectedRoutes, getMessagesByThread);

router.delete("/:messageId", protectedRoutes, deleteMessage);

export default router;
