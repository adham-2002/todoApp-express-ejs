import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import apiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeature.js";
//! @Nested Route
// GET /api/v1/categories/:categoryId/tasks
export const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

export const getTasks = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  let filter = req.filterObject || {};
  filter.user = req.user._id;
  const apiFeatures = new ApiFeatures(Task.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(await Task.countDocuments(filter));
  const tasks = await apiFeatures.mongooseQuery.populate("category", "name");
  res.status(200).json({
    status: "success",
    message: "Tasks fetched successfully",
    pagination: apiFeatures.paginationResult,
    data: tasks,
  });
});

export const createTask = asyncHandler(async (req, res, next) => {
  const { title, dueDate, categoryId, priority } = req.body;

  const task = await Task.create({
    title,
    dueDate,
    user: req.user._id,
    category: categoryId || null,
    priority,
  });
  res.status(201).json({
    status: "success",
    message: "Task created successfully",
    data: task,
  });
});
export const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, dueDate, completed, categoryId } = req.body;
  const task = await Task.findById(id); // we don't use findByIdAndUpdate because we need for pre("save") method
  if (!task) {
    return next(new apiError("Task not found", 404));
  }
  if (title !== undefined) task.title = title;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;
  task.category = categoryId || null;
  await task.save();

  res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    data: task,
  });
});
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return next(new apiError("Task not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
});
