import asyncHandler from "../../../utils/asyncHandler.js";
import CourseProgress from "../../../models/enrollment/courseProgress.model.js";
import AppError from "../../../utils/appError.js";
import ApiResponse from "../../../utils/apiResponse.js";
import LessonModel from "../../../db/models/courses/lesson.model.js";

export const updateCourseProgress = asyncHandler(async (req, res, next) => {
  const { courseId, moduleId, lessonId } = req.body;
  const userId = req.user._id;

  let courseProgress = await CourseProgress.findOne({ userId, courseId });

  if (!courseProgress) {
    return next(new AppError("Course progress not found", 404));
  }

  let moduleProgress = courseProgress.modulesCompleted.find(
    (mod) => mod.moduleId.toString() === moduleId
  );

  if (!moduleProgress) {
    courseProgress.modulesCompleted.push({
      moduleId,
      lessonsCompleted: [{ lessonId, completedAt: new Date() }],
    });
  } else {
    const lessonExists = moduleProgress.lessonsCompleted.some(
      (l) => l.lessonId.toString() === lessonId
    );

    if (!lessonExists) {
      moduleProgress.lessonsCompleted.push({
        lessonId,
        completedAt: new Date(),
      });
    }
  }

  for (let mod of courseProgress.modulesCompleted) {
    if (!mod.isCompleted) {
      const totalLessons = await LessonModel.countDocuments({
        moduleId: mod.moduleId,
      });

      const completedLessonIds = mod.lessonsCompleted.map((l) =>
        l.lessonId.toString()
      );

      if (completedLessonIds.length === totalLessons) {
        mod.isCompleted = true;
        mod.completionDate = new Date();
      }
    }
  }

  const totalModules = courseProgress.modulesCompleted.length;
  const completedModules = courseProgress.modulesCompleted.filter(
    (mod) => mod.isCompleted
  ).length;

  courseProgress.progressPercentage = Math.round(
    (completedModules / totalModules) * 100
  );

  if (courseProgress.progressPercentage === 100) {
    courseProgress.status = "COMPLETED";
  } else if (courseProgress.progressPercentage > 0) {
    courseProgress.status = "IN_PROGRESS";
  }

  courseProgress.lastUpdated = new Date();

  await courseProgress.save();

  return res
    .status(200)
    .json(new ApiResponse(200, courseProgress, "Progress updated"));
});
