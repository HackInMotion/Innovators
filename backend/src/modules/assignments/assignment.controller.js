import AssignmentModel from "../../../db/models/courses/assignment.model.js";
import ModuleModel from "../../../db/models/courses/module.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/AsyncHandler.js";

const createAssignment = asyncHandler(async (req, res, next) => {
  const { title, content, courseId, moduleId, dueDate } = req.body;

  const course = await ModuleModel.findById(courseId);

  if (!course) return next(new AppError(404, "course not found"));

  // check moduke by module id and courseid
  const moduleExists = await ModuleModel.findOne({ moduleId, courseId });

  if (!moduleExists) return next(new AppError(404, "module not found!"));

  let uploadedFileUrl = null;
  uploadedFileUrl = req.file ? req.file.fileName : null;

  const newAssignment = new AssignmentModel({
    title,
    content,
    courseId,
    moduleId,
    dueDate,
    assignmentPaper: uploadedFileUrl,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newAssignment, "Assignment Uploaded successfully")
    );
});

const updateAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { title, content, dueDate, courseId, moduleId } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) return next(new AppError(404, "Course not found"));

  const module = await ModuleModel.findOne({ _id: moduleId, courseId });
  if (!module)
    return next(new AppError(404, "Module not found in this course"));

  const assignment = await AssignmentModel.findOne({
    _id: assignmentId,
    moduleId,
  });
  if (!assignment)
    return next(new AppError(404, "Assignment not found in this module"));

  const updateFields = {};
  if (title) updateFields.title = title;
  if (content) updateFields.content = content;
  if (dueDate) updateFields.dueDate = dueDate;
  if (req.file) updateFields.assignmentPaper = req.file.filename;

  const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
    assignmentId,
    { $set: updateFields },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedAssignment, "Assignment updated successfully")
    );
});

const deleteAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { courseId, moduleId } = req.body;

  if (!assignmentId || !courseId || !moduleId) {
    return next(
      new AppError(400, "assignmentId, courseId, and moduleId are required")
    );
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new AppError(404, "Course not found"));
  }

  const module = await ModuleModel.findOne({ _id: moduleId, courseId });
  if (!module) {
    return next(new AppError(404, "Module not found for the given course"));
  }

  const assignment = await AssignmentModel.findById(assignmentId);
  if (!assignment) {
    return next(new AppError(404, "Assignment not found"));
  }

  await ModuleModel.updateOne(
    { _id: moduleId },
    { $pull: { assignments: assignmentId } }
  );

  await AssignmentModel.findByIdAndDelete(assignmentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Assignment deleted successfully"));
});

const getAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { courseId, moduleId } = req.body;

  if (!assignmentId || !courseId || !moduleId) {
    return next(
      new AppError(400, "assignmentId, courseId, and moduleId are required")
    );
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new AppError(404, "Course not found"));
  }

  const module = await ModuleModel.findOne({ _id: moduleId, courseId });
  if (!module) {
    return next(new AppError(404, "Module not found for the given course"));
  }

  const assignment = await AssignmentModel.findOne({
    _id: assignmentId,
    moduleId,
    courseId,
  });

  if (!assignment) {
    return next(new AppError(404, "Assignment not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment fetched successfully"));
});

export { createAssignment, getAssignment, updateAssignment, deleteAssignment };
