import ThreadModel from "../../../db/models/thread.model.js";
import asyncHandler from "../../utils/AsyncWrapper.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";

// Create a new thread
const createThread = asyncHandler(async (req, res, next) => {
  const { forumId, title, content } = req.body;

  if (!forumId || !title || !content) {
    return next(
      new AppError(400, "Missing required fields: forumId, title, content")
    );
  }

  const thread = new ThreadModel({
    forumId,
    userId: req.user._id,
    title,
    content,
  });

  await thread.save();

  res
    .status(201)
    .json(new ApiResponse(201, thread, "Thread created successfully"));
});

//Get threads by forumId
const getThreadsByForum = asyncHandler(async (req, res, next) => {
  const threads = await ThreadModel.find({
    forumId: req.params.forumId,
  }).populate("userId", "name email");

  if (!threads || threads.length === 0) {
    return next(new AppError(404, "No threads found for this forum"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, threads, "Threads fetched successfully"));
});

// Get a thread by ID
const getThreadById = asyncHandler(async (req, res, next) => {
  const thread = await ThreadModel.findById(req.params.id).populate(
    "userId",
    "name email"
  );

  if (!thread) {
    return next(new AppError(404, "Thread not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, thread, "Thread fetched successfully"));
});

export { createThread, getThreadById, getThreadsByForum };
