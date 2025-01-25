import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import apiError from "../utils/apiError.js";
//! @desc Get all categories
// @Route GET /api/v1/categories
// @access Private
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({
    $or: [
      { type: "predefined" },
      { type: "user-defined", userId: req.user._id },
    ],
  }).sort({ type: 1, name: 1 });
  res.status(200).json({
    status: "success",
    message: "Categories fetched successfully",
    data: categories,
  });
});
//! @desc Create Category
// @Route POST /api/v1/categories
// @access Private
export const createCategory = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { name } = req.body;
  const existingCategory = await Category.findOne({
    name,
    $or: [
      { type: "predefined" },
      { type: "user-defined", userId: req.user._id },
    ],
  });

  if (existingCategory) {
    return next(new apiError("Category already exists", 400));
  }
  const newCategory = await Category.create({
    name,
    type: "user-defined",
    userId: req.user._id,
  });
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: newCategory,
  });
});
//! @desc Update Category
// @Route PUT /api/v1/categories/:id
// @access Private
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!category) {
    return next(new apiError(`No Category with this id ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
});
//! @desc Delete Category
// @Route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new apiError(`No Category with this id ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
  });
});
