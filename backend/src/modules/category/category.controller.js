import CategoryModel from "../../../db/models/tags/category.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/AsyncHandler.js";

const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  const existingCategory = await CategoryModel.findOne({ name });

  if (existingCategory) {
    return next(new AppError(403, "Category with this name already exists."));
  }

  const categoryImageUrl = req.file
    ? `/${req.file.destination}/${req.file.filename}`
    : null;

  const newCategory = new CategoryModel({
    name,
    description,
    categoryImage: categoryImageUrl,
  });
  await newCategory.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newCategory, "Category created successfully!"));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "categoryId",
        as: "courses",
      },
    },
    {
      $project: {
        name: 1,
        categoryImage: 1,
        description: 1,
        // coursesCount: { $size: "$courses" },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully!"));
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  const existingCategory = await CategoryModel.findById(categoryId);

  if (!existingCategory) {
    return next(new AppError(404, "Category not found."));
  }

  const duplicateCategory = await CategoryModel.findOne({ name });

  if (duplicateCategory && duplicateCategory._id.toString() !== categoryId) {
    return next(new AppError(400, "Category with this name already exists."));
  }

  existingCategory.name = name;
  existingCategory.description = description || existingCategory.description;

  if (req.file) {
    existingCategory.categoryImage = `/${req.file.destination}/${req.file.filename}`;
  }
  const updatedCategory = await existingCategory.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully!")
    );
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const existingCategory = await CategoryModel.findById(categoryId);

  if (!existingCategory) {
    return next(new AppError(404, "Category not found."));
  }

  await CategoryModel.findByIdAndDelete(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully!"));
});

export { createCategory, getCategories, updateCategory, deleteCategory };
