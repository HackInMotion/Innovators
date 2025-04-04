import express from "express";
import {
  isAdmin,
  createChatGroup,
  getChatGroups,
  getChatGroupById,
  addMemberToGroup,
  removeMemberFromGroup,
  sendGroupMessage,
  getGroupMessages,
  editGroupMessage,
  deleteGroupMessage,
  transferAdminRole,
} from "./chatgroup.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const ChatGroupRouter = express.Router();

// Protected Routes
ChatGroupRouter.post("/", protectedRoutes, createChatGroup);
ChatGroupRouter.get("/", protectedRoutes, getChatGroups);
ChatGroupRouter.get("/:groupId", protectedRoutes, getChatGroupById);

// Admin-Only Routes
ChatGroupRouter.put(
  "/:groupId/add-member",
  protectedRoutes,
  isAdmin,
  addMemberToGroup
);
ChatGroupRouter.put(
  "/:groupId/remove-member",
  protectedRoutes,
  isAdmin,
  removeMemberFromGroup
);
ChatGroupRouter.put(
  "/:groupId/transfer-admin",
  protectedRoutes,
  isAdmin,
  transferAdminRole
);

// Messages (any member can send/edit/delete within time limit)
ChatGroupRouter.post("/:groupId/messages", protectedRoutes, sendGroupMessage);
ChatGroupRouter.get("/:groupId/messages", protectedRoutes, getGroupMessages);
ChatGroupRouter.put(
  "/:groupId/messages/:messageId/edit",
  protectedRoutes,
  editGroupMessage
);
ChatGroupRouter.delete(
  "/:groupId/messages/:messageId/delete",
  protectedRoutes,
  deleteGroupMessage
);

export default ChatGroupRouter;
