import ChatGroupModel from "../../../db/models/chatgroup.model.js";
import asyncHandler from "../../utils/AsyncWrapper.js";
import AppError from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";

const isAdmin = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await ChatGroupModel.findById(groupId);
  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  const member = group.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  if (!member || member.role !== "admin") {
    throw new AppError("Access denied. Admins only.", 403);
  }

  next();
});

const createChatGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  const newGroup = new ChatGroupModel({
    name,
    description,
    members: [{ user: userId, role: "admin" }],
    messages: [],
  });

  await newGroup.save();

  // Notify the creator
  req.io.to(userId.toString()).emit("groupCreated", newGroup);

  res.status(201).json(
    new ApiResponse(
      201,
      { group: newGroup },
      "Group created successfully"
    )
  );
});

const getChatGroups = asyncHandler(async (req, res) => {
  const groups = await ChatGroupModel.find().populate(
    "members.user",
    "username email"
  );
  
  res.json(
    new ApiResponse(
      200,
      { groups },
      "Groups retrieved successfully"
    )
  );
});

const getChatGroupById = asyncHandler(async (req, res) => {
  const group = await ChatGroupModel.findById(req.params.groupId)
    .populate("members.user", "username email")
    .populate("messages.sender", "username email");

  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  res.json(
    new ApiResponse(
      200,
      { group },
      "Group retrieved successfully"
    )
  );
});

const addMemberToGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  const group = await ChatGroupModel.findById(groupId);
  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  if (group.members.some((m) => m.user.toString() === userId)) {
    throw new AppError("User is already a member", 400);
  }

  group.members.push({ user: userId, role: "member" });
  await group.save();

  // Notify the new member and group
  req.io.to(userId.toString()).emit("addedToGroup", { groupId });
  req.io.to(groupId).emit("groupMemberListUpdated", { groupId });

  res.json(
    new ApiResponse(
      200,
      null,
      "User added to the group successfully"
    )
  );
});

const removeMemberFromGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await ChatGroupModel.findById(groupId);
  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  group.members = group.members.filter((m) => m.user.toString() !== userId);
  await group.save();

  // Notify the removed user and group
  req.io.to(userId.toString()).emit("removedFromGroup", { groupId });
  req.io.to(groupId).emit("groupMemberListUpdated", { groupId });

  res.json(
    new ApiResponse(
      200,
      null,
      "User removed from the group successfully"
    )
  );
});

const sendGroupMessage = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { content } = req.body;
  const senderId = req.user._id;

  const group = await ChatGroupModel.findById(groupId);
  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  const newMessage = {
    sender: senderId,
    content,
    createdAt: new Date(),
    editedAt: null,
    isDeleted: false,
  };

  group.messages.push(newMessage);
  await group.save();

  const populatedMessage = await ChatGroupModel.populate(newMessage, {
    path: "sender",
    select: "username email",
  });

  req.io.to(groupId).emit("newGroupMessage", {
    groupId,
    message: populatedMessage,
  });

  res.json(
    new ApiResponse(
      200,
      { message: populatedMessage },
      "Message sent successfully"
    )
  );
});

const getGroupMessages = asyncHandler(async (req, res) => {
  const group = await ChatGroupModel.findById(req.params.groupId)
    .populate("messages.sender", "username email");

  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  req.io.to(req.params.groupId).emit("groupMessages", group.messages);

  res.json(
    new ApiResponse(
      200,
      { messages: group.messages },
      "Messages retrieved successfully"
    )
  );
});

const editGroupMessage = asyncHandler(async (req, res) => {
  const { groupId, messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const group = await ChatGroupModel.findById(groupId);
  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  const message = group.messages.id(messageId);
  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (message.sender.toString() !== userId.toString()) {
    throw new AppError("Unauthorized to edit this message", 403);
  }

  message.content = content;
  message.editedAt = new Date();
  await group.save();

  req.io.to(groupId).emit("groupMessageEdited", {
    groupId,
    messageId: message._id,
    newContent: message.content,
    editedAt: message.editedAt,
  });

  res.json(
    new ApiResponse(
      200,
      { message },
      "Message updated successfully"
    )
  );
});

const deleteGroupMessage = asyncHandler(async (req, res) => {
  const { groupId, messageId } = req.params;
  const userId = req.user._id;

  const group = await ChatGroupModel.findById(groupId);
  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  const message = group.messages.id(messageId);
  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (message.sender.toString() !== userId.toString()) {
    throw new AppError("Unauthorized to delete this message", 403);
  }

  // Soft delete approach
  message.isDeleted = true;
  await group.save();

  req.io.to(groupId).emit("groupMessageDeleted", {
    groupId,
    messageId,
    deletedBy: userId,
    deletedAt: new Date(),
  });

  res.json(
    new ApiResponse(
      200,
      null,
      "Message deleted successfully"
    )
  );
});

const transferAdminRole = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { newAdminId } = req.body;
  const currentAdminId = req.user._id;

  const group = await ChatGroupModel.findById(groupId);
  if (!group) {
    throw new AppError("Chat group not found", 404);
  }

  const currentAdmin = group.members.find(
    (m) => m.user.toString() === currentAdminId.toString() && m.role === "admin"
  );
  if (!currentAdmin) {
    throw new AppError("Only the current admin can transfer admin rights", 403);
  }

  const newAdmin = group.members.find(
    (m) => m.user.toString() === newAdminId
  );
  if (!newAdmin) {
    throw new AppError("User is not a member of this group", 400);
  }

  currentAdmin.role = "member";
  newAdmin.role = "admin";
  await group.save();

  req.io.to(groupId).emit("groupAdminUpdated", {
    groupId,
    newAdminId,
  });

  res.json(
    new ApiResponse(
      200,
      null,
      "Admin role transferred successfully"
    )
  );
});

export {
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
};