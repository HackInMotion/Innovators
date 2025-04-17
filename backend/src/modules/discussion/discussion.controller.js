import DiscussionModel from "../../../db/models/community/discussion.model.js";
import ForumModel from "../../../db/models/community/forum.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/AsyncHandler.js";


const createDiscussion = asyncHandler(async (req, res, next) => {
  const { content, forumId } = req.body;
  const createdBy = req.user._id;
  const image = req.file ? req.file.filename : null;

  if (!content || !forumId) {
    return next(new AppError(400, "Content and forum ID are required"));
  }

  const forum = await ForumModel.findById(forumId);
  if (!forum) {
    return next(new AppError(404, "Forum not found"));
  }

  const discussion = new DiscussionModel({
    content,
    createdBy,
    forum: forumId,
    image,
  });

  const savedDiscussion = await discussion.save();

  forum.discussions.push(savedDiscussion._id);
  await forum.save();

  return res.status(201).json(new ApiResponse(201, savedDiscussion, "Discussion created successfully"));
});

const getDiscussionsByForum = asyncHandler(async (req, res, next) => {
  const { forumId } = req.params;

  const discussions = await DiscussionModel.find({ forum: forumId })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });

  return res.json(new ApiResponse(200, discussions, "Discussions fetched successfully"));
});

const updateDiscussion = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { content, removeImage } = req.body;
  const userId = req.user._id;

  const image = req.file ? req.file.filename : null;

  if (!content && !image && !removeImage) {
    return next(new AppError(400, "Nothing to update"));
  }

  const discussion = await DiscussionModel.findById(id);
  if (!discussion) {
    return next(new AppError(404, "Discussion not found"));
  }

  if (discussion.createdBy.toString() !== userId.toString()) {
    return next(new AppError(403, "Not authorized to update this discussion"));
  }

  if (content) discussion.content = content;
  if (image) discussion.image = image;
  if (removeImage === "true" || removeImage === true) discussion.image = null;

  const updatedDiscussion = await discussion.save();
  return res.json(new ApiResponse(200, updatedDiscussion, "Discussion updated successfully"));
});

const deleteDiscussion = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  const discussion = await DiscussionModel.findById(id);
  if (!discussion) {
    return next(new AppError(404, "Discussion not found"));
  }

  if (discussion.createdBy.toString() !== userId.toString() && !isAdmin) {
    return next(new AppError(403, "Not authorized to delete this discussion"));
  }

  await ForumModel.findByIdAndUpdate(
    discussion.forum,
    { $pull: { discussions: discussion._id } },
    { new: true }
  );

  await DiscussionModel.findByIdAndDelete(id);

  return res.json(new ApiResponse(200, null, "Discussion deleted successfully"));
});

export { createDiscussion, getDiscussionsByForum, updateDiscussion, deleteDiscussion };
