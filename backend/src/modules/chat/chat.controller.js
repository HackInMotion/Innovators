import ChatModel from "../../../db/models/Messaging/chat.model.js";
import mongoose from "mongoose";
import asyncHandler from "../../utils/AsyncWrapper.js";
import AppError from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";

// Fetch or Create Private Chat
const getOrCreateChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid User ID", 400);
  }

  let chat = await ChatModel.findOne({
    participants: { $all: [currentUserId, userId] },
  });

  if (!chat) {
    chat = await ChatModel.create({
      participants: [currentUserId, userId],
      messages: [],
    });
    
    // Notify both users about new chat creation
    req.io.to(currentUserId).to(userId).emit("newChatCreated", chat);
  }

  // Join the chat room for real-time updates
  req.io.to(chat._id.toString()).emit("userJoinedChat", {
    chatId: chat._id,
    userId: currentUserId
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { chat },
      chat.messages.length ? "Chat retrieved successfully" : "New chat created"
    )
  );
});

// Send a Message
const sendChatMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new AppError("Invalid Chat ID", 400);
  }

  const chat = await ChatModel.findById(chatId);
  if (!chat) throw new AppError("Chat not found", 404);

  const message = {
    sender: senderId,
    content,
    createdAt: new Date(),
    editedAt: null,
    isDeleted: false
  };

  chat.messages.push(message);
  await chat.save();

  // Emit to all participants in the chat room
  const populatedMessage = await ChatModel.populate(message, {
    path: 'sender',
    select: 'name email avatar'
  });

  req.io.to(chatId).emit("newChatMessage", {
    chatId,
    message: populatedMessage
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { message: populatedMessage },
      "Message sent successfully"
    )
  );
});

// Edit a Message (Only within 5 minutes)
const editChatMessage = asyncHandler(async (req, res) => {
  const { chatId, messageId, newContent } = req.body;
  const userId = req.user.id;

  const chat = await ChatModel.findById(chatId);
  if (!chat) throw new AppError("Chat not found", 404);

  const message = chat.messages.id(messageId);
  if (!message) throw new AppError("Message not found", 404);

  if (message.sender.toString() !== userId) {
    throw new AppError("Unauthorized to edit this message", 403);
  }

  const timeDifference = (new Date() - message.createdAt) / 1000 / 60;
  if (timeDifference > 5) {
    throw new AppError("Editing time expired (5 minutes limit)", 400);
  }

  message.content = newContent;
  message.editedAt = new Date();
  await chat.save();

  req.io.to(chatId).emit("chatMessageEdited", {
    chatId,
    messageId,
    newContent,
    editedAt: message.editedAt
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { message },
      "Message edited successfully"
    )
  );
});

// Delete a Message (Soft Delete within 5 minutes)
const deleteChatMessage = asyncHandler(async (req, res) => {
  const { chatId, messageId } = req.body;
  const userId = req.user.id;

  const chat = await ChatModel.findById(chatId);
  if (!chat) throw new AppError("Chat not found", 404);

  const message = chat.messages.id(messageId);
  if (!message) throw new AppError("Message not found", 404);

  if (message.sender.toString() !== userId) {
    throw new AppError("Unauthorized to delete this message", 403);
  }

  const timeDifference = (new Date() - message.createdAt) / 1000 / 60;
  if (timeDifference > 5) {
    throw new AppError("Deletion time expired (5 minutes limit)", 400);
  }

  // Soft delete approach
  message.isDeleted = true;
  await chat.save();

  req.io.to(chatId).emit("chatMessageDeleted", {
    chatId,
    messageId,
    deletedBy: userId,
    deletedAt: new Date()
  });

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Message deleted successfully"
    )
  );
});

// Fetch Chat Messages
const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  
  const chat = await ChatModel.findById(chatId)
    .populate("participants", "name email avatar")
    .populate("messages.sender", "name email avatar");
    
  if (!chat) throw new AppError("Chat not found", 404);

  res.status(200).json(
    new ApiResponse(
      200,
      { messages: chat.messages },
      "Messages retrieved successfully"
    )
  );
});

export {
  getOrCreateChat,
  getChatMessages,
  deleteChatMessage,
  sendChatMessage,
  editChatMessage,
};