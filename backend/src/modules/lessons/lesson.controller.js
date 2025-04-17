import CourseModel from "../../../db/models/courses/courses.model.js";
import LessonModel from "../../../db/models/courses/lesson.model.js";
import ModuleModel from "../../../db/models/courses/module.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import { getVideoDurationInSeconds } from "get-video-duration";

const reorderLessons = async (moduleId) => {
  const lessons = await LessonModel.find({ moduleId }).sort("order");
  for (let i = 0; i < lessons.length; i++) {
    lessons[i].order = i + 1;
    await lessons[i].save();
  }
};

const getVideoDuration = async (file) => {
  let videoDuration = null;
  const durationInSeconds = await getVideoDurationInSeconds(
    `E:/Innovators/backend${file}`
  );
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  videoDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return videoDuration;
};

const createLesson = asyncHandler(async (req, res, next) => {
  const { title, content, courseId, moduleId, order = 1 } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) return next(new AppError(404, "Course not found"));

  const module = await ModuleModel.findById(moduleId);
  if (!module || module.courseId.toString() !== courseId) {
    return next(
      new AppError(404, "Module not found or doesn't belong to the course")
    );
  }

  const videoUrl = req.file
    ? `/${req.file.destination}/${req.file.filename}`
    : null;

  const lessonCount = await LessonModel.countDocuments({ moduleId });

  const newOrder =
    order && order > 0 && order <= lessonCount + 1 ? order : lessonCount + 1;

  if (newOrder <= lessonCount) {
    await LessonModel.updateMany(
      { moduleId, order: { $gte: newOrder } },
      { $inc: { order: 1 } }
    );
  }

  let duration = await getVideoDuration(videoUrl);
  const lesson = await LessonModel.create({
    title,
    content,
    courseId,
    moduleId,
    duration: duration,
    order: newOrder,
    videoUrl,
  });

  module.lessons.push(lesson._id);
  await module.save();

  return res
    .status(201)
    .json(new ApiResponse(201, lesson, "Lesson created successfully"));
});

const updateLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const { title, content, courseId, moduleId, duration, notes, order } =
    req.body;

  const lesson = await LessonModel.findById(lessonId);
  if (!lesson) return next(new AppError(404, "Lesson not found"));

  if (courseId) {
    const course = await CourseModel.findById(courseId);
    if (!course) return next(new AppError(404, "Course not found"));
    lesson.courseId = courseId;
  }

  let moduleChanged = false;

  if (moduleId && moduleId !== lesson.moduleId.toString()) {
    const module = await ModuleModel.findById(moduleId);
    if (
      !module ||
      module.courseId.toString() !== (courseId || lesson.courseId.toString())
    ) {
      return next(
        new AppError(404, "Module not found or doesn't match course")
      );
    }
    moduleChanged = true;
    lesson.moduleId = moduleId;
  }

  if (title) lesson.title = title;
  if (content) lesson.content = content;
  if (duration) lesson.duration = duration;
  if (notes) lesson.notes = notes;

  if (req.file?.filename) lesson.videoUrl = req.file.filename;

  const originalOrder = lesson.order;

  if (order && order !== originalOrder) {
    const lessonCount = await LessonModel.countDocuments({
      moduleId: lesson.moduleId,
    });
    const newOrder = Math.min(order, lessonCount);

    if (newOrder > originalOrder) {
      await LessonModel.updateMany(
        {
          moduleId: lesson.moduleId,
          order: { $gt: originalOrder, $lte: newOrder },
        },
        { $inc: { order: -1 } }
      );
    } else {
      await LessonModel.updateMany(
        {
          moduleId: lesson.moduleId,
          order: { $gte: newOrder, $lt: originalOrder },
        },
        { $inc: { order: 1 } }
      );
    }

    lesson.order = newOrder;
  }

  const updated = await lesson.save();

  if (moduleChanged) {
    await reorderLessons(lesson.moduleId);
    await reorderLessons(req.body.oldModuleId || lesson.moduleId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Lesson updated successfully"));
});

const deleteLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  const lesson = await LessonModel.findByIdAndDelete(lessonId);
  if (!lesson) return next(new AppError(404, "Lesson not found"));

  await LessonModel.updateMany(
    { moduleId: lesson.moduleId, order: { $gt: lesson.order } },
    { $inc: { order: -1 } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Lesson deleted successfully"));
});

const getLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  const lesson = await LessonModel.findById(lessonId)
    .populate("courseId", "title")
    .populate("moduleId", "title");

  if (!lesson) return next(new AppError(404, "Lesson not found"));

  return res
    .status(200)
    .json(new ApiResponse(200, lesson, "Lesson fetched successfully"));
});

export { createLesson, updateLesson, getLesson, deleteLesson };
