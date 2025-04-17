import CourseModel from "../../../db/models/courses/courses.model.js";
import CategoryModel from "../../../db/models/tags/category.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import SubCategoryModel from "../../../db/models/tags/subcategory.model.js";
import fs from "fs";
import path from "path";
import EnrollmentModel from "../../../db/models/orders/enrollment.model.js";

const createCourse = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    price,
    categoryId,
    subcategoryId,
    whatLearn = [],
    requirements = [],
    outcomes = [],
  } = req.body;

  const user = req.user;

  if (!user?.id) {
    return next(new AppError(401, "Unauthorized access"));
  }

  const instructorId = user.id;

  const categoryExists = await CategoryModel.findById(categoryId);
  if (!categoryExists) {
    return next(new AppError(404, "Category not found."));
  }

  const subcategoryExists = await SubCategoryModel.findById(subcategoryId);
  if (!subcategoryExists) {
    return next(new AppError(404, "Subcategory not found."));
  }

  let coverImageUrl = "";

  if (req.file) {
    coverImageUrl = `/${req.file.destination}/${req.file.filename}`;
  }

  const newCourse = await CourseModel.create({
    title: title.trim(),
    description: description.trim(),
    coverImage: coverImageUrl,
    price: parseFloat(price) || 0,
    categoryId,
    subcategoryId,
    instructorId,
    whatLearn,
    requirements,
    outcomes,
  });

  subcategoryExists.courses.push(newCourse._id);
  await subcategoryExists.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newCourse, "Course created successfully!"));
});

const getCoursesByCategory = asyncHandler(async (req, res, next) => {
  const { name, page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    return next(new AppError(400, "Invalid pagination parameters"));
  }

  const foundsubCategory = await SubCategoryModel.findOne({ name });

  if (!foundsubCategory) {
    return next(new AppError(404, "Category not found"));
  }

  const skip = (pageNumber - 1) * limitNumber;

  const [courses, totalCount] = await Promise.all([
    CourseModel.find({
      subcategoryId: foundsubCategory._id,
    })
      .skip(skip)
      .limit(limitNumber)
      .populate("categoryId", "name")
      .populate("instructorId", "fullname")
      .populate({
        path: "modules",
        select: "title lessons",
        populate: {
          path: "lessons",
          select: "_id",
        },
      }),
    CourseModel.countDocuments({ subcategoryId: foundsubCategory._id }),
  ]);

  const result = courses.map((course) => {
    const lessonCount = course.modules.reduce(
      (sum, mod) => sum + (mod.lessons?.length || 0),
      0
    );

    return {
      id: course._id,
      title: course.title,
      coverImage: course.coverImage,
      price: course.price,
      categoryName: course.categoryId?.name,
      instructorName: course.instructorId?.fullname,
      countModules: course.modules.length,
      countLessons: lessonCount,
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        courses: result,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalCount / limitNumber),
          totalItems: totalCount,
          itemsPerPage: limitNumber,
        },
      },
      "Courses retrieved successfully"
    )
  );
});

const getAllCourses = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const courses = await CourseModel.find({})
    .skip(skip)
    .limit(limit)
    .populate("instructorId", "fullname profilePicture")
    .populate("categoryId", "name")
    .populate("subcategoryId", "name")
    .populate({
      path: "modules",
      populate: [{ path: "lessons" }, { path: "assignments" }],
    })
    .select("-__v -createdAt -updatedAt");

  if (!courses || courses.length === 0) {
    return next(new AppError(404, "No courses found"));
  }

  const totalCourses = await CourseModel.countDocuments({});

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCourses / limit),
          totalItems: totalCourses,
          itemsPerPage: limit,
        },
      },
      "Courses fetched successfully"
    )
  );
});

const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await CourseModel.findById(id)
    .populate("instructorId", "fullname profilePicture")
    .populate("categoryId", "name")
    .populate("subcategoryId", "name")
    .populate({
      path: "modules",
      populate: {
        path: "lessons",
      },
    });

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const totalLessons = course.modules.reduce(
    (sum, module) => sum + (module.lessons?.length || 0),
    0
  );

  const totalDurationInSeconds = course.modules.reduce((sum, module) => {
    return (
      sum +
      module.lessons.reduce((lessonSum, lesson) => {
        if (!lesson.duration) return lessonSum;
        const [minutes, seconds] = lesson.duration.split(":").map(Number);
        return lessonSum + minutes * 60 + seconds;
      }, 0)
    );
  }, 0);

  const enrolledStudentCount =
    (await EnrollmentModel.countDocuments({ courseId: id })) || 0;

  const hours = Math.floor(totalDurationInSeconds / 3600);
  const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
  const seconds = totalDurationInSeconds % 60;

  const totalDuration =
    hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        course,
        totalLessons,
        totalDuration,
        enrolledStudentCount,
      },
      "course successfully!"
    )
  );
});

const updateCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const {
    title,
    description,
    price,
    categoryId,
    subcategoryId,
    whatLearn,
    requirements,
    outcomes,
  } = req.body;
  const file = req.file;
  const instructorId = req.user.id;

  // Validate required fields
  if (
    !title &&
    !description &&
    price === undefined &&
    !categoryId &&
    !subcategoryId &&
    !file &&
    !whatLearn &&
    !requirements &&
    !outcomes
  ) {
    return next(
      new AppError(400, "At least one field must be provided for update")
    );
  }

  // Find the course
  const course = await CourseModel.findOne({ _id: courseId, instructorId });
  if (!course) {
    return next(
      new AppError(
        404,
        "Course not found or you don't have permission to edit this course"
      )
    );
  }

  // Handle file upload
  let coverImageUrl = course.coverImage;
  if (file) {
    try {
      // Delete old image if it exists (implement this function based on your storage)
      if (course.coverImage) {
        await deleteFile(course.coverImage);
      }
      coverImageUrl = `/uploads/${file.filename}`; // Adjust path as needed
    } catch (error) {
      return next(new AppError(500, "Failed to process image upload"));
    }
  }

  // Validate category and subcategory if provided
  if (categoryId) {
    const categoryExists = await CategoryModel.findById(categoryId);
    if (!categoryExists) {
      return next(new AppError(400, "Invalid category ID"));
    }
  }

  if (subcategoryId) {
    const subcategoryExists = await SubCategoryModel.findById(subcategoryId);
    if (!subcategoryExists) {
      return next(new AppError(400, "Invalid subcategory ID"));
    }
    // Optional: Verify subcategory belongs to category
    if (categoryId && subcategoryExists.categoryId.toString() !== categoryId) {
      return next(
        new AppError(
          400,
          "Subcategory does not belong to the specified category"
        )
      );
    }
  }

  // Update course fields
  const updates = {
    title: title || course.title,
    description: description || course.description,
    price: price !== undefined ? parseFloat(price) : course.price,
    coverImage: coverImageUrl,
    subcategoryId: subcategoryId || course.subcategoryId,
    categoryId: categoryId || course.categoryId,
    whatLearn: whatLearn ? whatLearn : course.whatLearn,
    requirements: requirements ? requirements : course.requirements,
    outcomes: outcomes ? outcomes : course.outcomes,
    updatedAt: Date.now(),
  };

  // Apply updates
  Object.assign(course, updates);

  try {
    const updatedCourse = await course.save();

    // Optional: Populate related data for response
    const populatedCourse = await CourseModel.findById(updatedCourse._id)
      .populate("categoryId", "name")
      .populate("subcategoryId", "name")
      .populate("instructorId", "fullname profilePicture");

    res.status(200).json({
      success: true,
      data: populatedCourse,
      message: "Course updated successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return next(new AppError(400, messages.join(", ")));
    }
    return next(new AppError(500, "Failed to update course"));
  }
});
const deleteFile = async (filePath) => {
  const fullPath = `E:/Innovators/backend${filePath}`;

  return new Promise((resolve, reject) => {
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== "ENOENT") {
        // Ignore file not found errors
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const deleteCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  if (!req?.user?.id) {
    return next(new AppError(401, "Unauthorized access"));
  }

  const instructorId = req.user.id;

  const course = await CourseModel.findById(courseId);

  if (!course) {
    return next(new AppError(404, "Course not found"));
  }

  if (course.instructorId.toString() !== instructorId.toString()) {
    return next(
      new AppError(403, "You are not authorized to delete this course")
    );
  }

  await CourseModel.findByIdAndDelete(courseId);

  await SubCategoryModel.updateMany(
    { courses: courseId },
    { $pull: { courses: courseId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Course deleted successfully"));
});

export {
  deleteCourse,
  createCourse,
  getAllCourses,
  getCoursesByCategory,
  updateCourse,
  getCourseById,
};
