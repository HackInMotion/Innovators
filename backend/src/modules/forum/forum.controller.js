import ForumModel from "../../../db/models/forum.model.js";
import asyncHandler from "../../utils/asyncWrapper.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";

// Create Forum
const createForum = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new AppError(400, "Title and description are required"));
  }

  const existingForum = await ForumModel.findOne({ title });
  if (existingForum) {
    return next(new AppError(400, "A forum with this title already exists"));
  }


  const forum = new ForumModel({
    title,
    description,
    createdBy: req.user._id,
  });

  await forum.save();

  res
    .status(201)
    .json(new ApiResponse(201, forum, "Forum created successfully"));
});

// Get all forums
const getForums = asyncHandler(async (req, res, next) => {
  const forums = await ForumModel.find().populate("createdBy", "username email"); 
  if (!forums || forums.length === 0) {
    return next(new AppError(404, "No forums found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, forums, "Forums retrieved successfully"));
});

// Get forum by ID
const getForumById = asyncHandler(async (req, res, next) => {
  const forum = await ForumModel.findById(req.params.id).populate("createdBy", "username email");

  if (!forum) {
    return next(new AppError(404, "Forum not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, forum, "Forum retrieved successfully"));
});

export { createForum, getForumById, getForums };
