import asyncHandler from "../../utils/AsyncWrapper.js";
import AppError from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import MessageModel from "../../../db/models/message.model.js";
import ThreadModel from "../../../db/models/thread.model.js";

// Create a new message
const createMessage = asyncHandler(async (req, res, next) => {
  const { threadId, content } = req.body;

  if (!threadId || !content) {
    return next(new AppError(400, "Both threadId and content are required"));
  }

  const thread = await ThreadModel.findById(threadId);
  if (!thread) {
    return next(new AppError(404, "Thread not found"));
  }

  const userId = req.user._id;

  if (content.trim().length < 1) {
    return next(new AppError(400, "Message content cannot be empty or too short"));
  }

  const message = new MessageModel({
    threadId,
    userId,
    content,
  });

  await message.save();

  res
    .status(201)
    .json(new ApiResponse(201, message, "Message created successfully"));
});

// Get messages by thread ID
const getMessagesByThread = asyncHandler(async (req, res, next) => {
  const { threadId } = req.params;

  const messages = await MessageModel.find({ threadId }).populate("userId", "username email");

  if (!messages || messages.length === 0) {
    return next(new AppError(404, "No messages found for this thread"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages retrieved successfully"));
});

// Delete a message
const deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await MessageModel.findById(messageId);

  if (!message) {
    return next(new AppError(404, "Message not found"));
  }

  // Check if the user is the one who created the message
  if (String(message.userId) !== String(req.user._id)) {
    return next(new AppError(403, "Unauthorized to delete this message"));
  }

  await MessageModel.findByIdAndDelete(messageId);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Message deleted successfully"));
});

export { createMessage, getMessagesByThread, deleteMessage };
