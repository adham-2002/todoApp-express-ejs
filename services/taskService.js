import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import apiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeature.js";
import TaskAssignment from "../models/taskAssignmentModel.js";
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
// GET /api/v1/tasks
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
  const { title, dueDate, categoryId, priority, description, taskType, group } =
    req.body;

  const task = await Task.create({
    title,
    description,
    group: req.params.groupId || group || null,
    taskType,
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
  const { title, dueDate, categoryId, priority, description, completed } =
    req.body;

  // Find the task
  const task = await Task.findById(id);
  if (!task) {
    return next(new apiError("Task not found", 404));
  }

  // Check if the user is an admin
  if (req.member.role === "admin") {
    // Admin can update any field
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.category = categoryId || task.category;
  } else {
    // Check if the user is assigned to the task
    const isAssigned = await TaskAssignment.findOne({
      task: id,
      assignedTo: req.user._id,
    });

    if (!isAssigned) {
      return next(new apiError("You are not assigned to the task", 403));
    }

    // Only allow the assigned user to mark the task as completed
    if (completed !== undefined) {
      task.completed = completed;
    } else {
      return next(
        new apiError("You are not authorized to update this task", 403)
      );
    }
  }

  await task.save();

  res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    data: task,
  });
});
// only admin can delete a task for group
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
