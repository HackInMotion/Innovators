import express from "express";
import {
  getOrCreateChat,
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
  getChatMessages,
} from "./chat.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const chatRouter = express.Router();

chatRouter.post("/get-or-create", protectedRoutes, getOrCreateChat);
chatRouter.post("/send", protectedRoutes, sendChatMessage);
chatRouter.put("/edit", protectedRoutes, editChatMessage);
chatRouter.delete("/delete", protectedRoutes, deleteChatMessage);
chatRouter.get("/:chatId/messages", protectedRoutes, getChatMessages);

export default chatRouter;
