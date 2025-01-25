import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import apiError from "../utils/apiError.js";
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
