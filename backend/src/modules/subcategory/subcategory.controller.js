import CategoryModel from "../../../db/models/tags/category.model.js";
import SubCategoryModel from "../../../db/models/tags/subcategory.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/AsyncHandler.js";

const createSubcategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId } = req.body;

  const categoryExists = await CategoryModel.findById(categoryId);
  if (!categoryExists) {
    return next(new AppError(404, "Category not found."));
  }

  const existing = await SubCategoryModel.findOne({ name, categoryId });
  if (existing) {
    return next(
      new AppError(
        403,
        "Subcategory with this name already exists in this category."
      )
    );
  }

  const subcategoryImageUrl = req.file
    ? `/${req.file.destination}/${req.file.filename}`
    : null;

  const newSubcategory = new SubCategoryModel({
    name,
    categoryId,
    subcategoryImage: subcategoryImageUrl,
  });

  await newSubcategory.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, newSubcategory, "Subcategory created successfully!")
    );
});

const getSubcategories = asyncHandler(async (req, res, next) => {
  const { name } = req.query;

  const category = await CategoryModel.findOne({ name });

  if (!category) {
    throw next(new AppError(404, "Category not found"));
  }

  const subcategories = await SubCategoryModel.find({
    categoryId: category._id,
  }).populate("categoryId", "name").select("-createdAt -updatedAt -__v");

  return res
    .status(200)
    .json(
      new ApiResponse(200, subcategories, "Subcategories fetched successfully!")
    );
})

const updateSubcategory = asyncHandler(async (req, res, next) => {
  const { subcategoryId } = req.params;
  const { name, categoryId } = req.body;

  const categoryExists = await CategoryModel.findById(categoryId);
  if (!categoryExists) {
    return next(new AppError(404, "Category not found."));
  }

  const existingSubcategory = await SubCategoryModel.findById(subcategoryId);
  if (!existingSubcategory) {
    return next(new AppError(404, "Subcategory not found."));
  }

  const duplicate = await SubCategoryModel.findOne({ name, categoryId });
  if (duplicate && duplicate._id.toString() !== subcategoryId) {
    return next(
      new AppError(
        400,
        "Subcategory with this name already exists in this category."
      )
    );
  }

  existingSubcategory.subcategoryImage = req.file
    ? `/${req.file.destination}/${req.file.filename}`
    : existingSubcategory.subcategoryImage;
  existingSubcategory.name = name;
  existingSubcategory.categoryId = categoryId;

  const updated = await existingSubcategory.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Subcategory updated successfully!"));
});

const deleteSubcategory = asyncHandler(async (req, res, next) => {
  const { subcategoryId } = req.params;

  const subcategory = await SubCategoryModel.findById(subcategoryId);
  if (!subcategory) {
    return next(new AppError(404, "Subcategory not found."));
  }

  await SubCategoryModel.findByIdAndDelete(subcategoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subcategory deleted successfully!"));
});

export {
  createSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory,
};
