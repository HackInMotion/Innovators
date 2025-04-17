import AssignmentModel from "../../../db/models/courses/assignment.model.js";
import CourseModel from "../../../db/models/courses/courses.model.js";
import LessonModel from "../../../db/models/courses/lesson.model.js";
import ModuleModel from "../../../db/models/courses/module.model.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import AppError from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";

// Create Module
const createModule = asyncHandler(async (req, res) => {
  const { title, courseId } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new AppError(404, "Course not found");
  }

  const lastModule = await ModuleModel.findOne({ courseId }).sort("-order");

  const order = lastModule ? lastModule.order + 1 : 1;

  const module = await ModuleModel.create({
    title,
    courseId,
    order,
  });
  course.modules.push(module._id);
  await course.save();

  res
    .status(201)
    .json(new ApiResponse(201, module, "Module created successfully"));
});

const getModulesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const modules = await ModuleModel.find({ courseId })
    .populate("lessons")
    .populate("assignments")
    .sort("order");

  res
    .status(200)
    .json(new ApiResponse(200, modules, "Modules fetched successfully"));
});

// Get Single Module
const getModuleById = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;

  const module = await ModuleModel.findById(moduleId)
    .populate("lessons")
    .populate("assignments")
    .select("-createdAt -updatedAt -__v");

  if (!module) {
    throw new AppError(404, "Module not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, module, "Module fetched successfully"));
});

// Update Module
const updateModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const { title } = req.body;

  const updated = await ModuleModel.findByIdAndUpdate(moduleId, { title });

  if (!updated) {
    throw new AppError(404, "Module not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Module updated successfully"));
});

// Delete Module
const deleteModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;

  const module = await ModuleModel.findById(moduleId);
  if (!module) {
    throw new AppError(404, "Module not found");
  }

  const courseId = module.courseId;

  await LessonModel.deleteMany({ _id: { $in: module.lessons } });
  await AssignmentModel.deleteMany({ _id: { $in: module.assignments } });

  await ModuleModel.findByIdAndDelete(moduleId);

  const remainingModules = await ModuleModel.find({ courseId }).sort("order");

  for (let i = 0; i < remainingModules.length; i++) {
    await ModuleModel.findByIdAndUpdate(
      remainingModules[i]._id,
      { order: i + 1 },
      { new: true }
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Module deleted and orders updated successfully"
      )
    );
});

export {
  createModule,
  getModuleById,
  getModulesByCourse,
  updateModule,
  deleteModule,
};
