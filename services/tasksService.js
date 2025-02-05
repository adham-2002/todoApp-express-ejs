import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import apiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeature.js";
import GroupMember from "../models/groupMembersModel.js";
//! Create Personal Task
// @Route POST /api/v1/tasks
// @Access Private
export const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, priority, dueDate, taskType, category, group } =
    req.body;
  // check the type of task
  if (taskType === "Personal") {
    if (group) {
      return next(new apiError("Personal tasks cannot have a group", 400));
    }
    // create the task and save it
    const task = await Task.create({
      title,
      description,
      priority: priority || "low",
      dueDate: dueDate || null,
      createdBy: req.user._id,
      taskType: "Personal",
      category: category || null,
    });

    return res.status(201).json({
      status: "success",
      message: "Personal task created successfully",
      data: task,
    });
    //h1 if task type is group
  } else if (taskType === "Group") {
    // check if group id is provided
    if (!group) {
      return next(new apiError("Group ID is required for group tasks", 400));
    }
    // check if user is admin or member of the group
    const membership = await GroupMember.findOne({
      group: group,
      user: req.user._id,
    });
    // if user is not a member of the group
    if (!membership) {
      return next(new apiError("You are not a member of this group", 403));
    }
    // if user is not an admin
    if (membership.role !== "admin") {
      return next(
        new apiError("Admin privileges required to create group tasks", 403)
      );
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "low",
      dueDate: dueDate || null,
      createdBy: req.user._id,
      taskType: "Group",
      category: category || null,
      group: group,
    });

    return res.status(201).json({
      status: "success",
      message: "Group task created successfully",
      data: task,
    });
  } else {
    return next(
      new apiError("Invalid task type. Allowed values: Personal/Group", 400)
    );
  }
});
//! Get all tasks
// @Route GET /api/v1/tasks
// @Access Private member and admin can get all tasks in group
export const getTasks = asyncHandler(async (req, res, next) => {
  // Get user's groups
  const userGroups = await GroupMember.find({ user: req.user._id });
  const groupIds = userGroups.map((g) => g.group);

  // Build filter
  const filter = {
    $or: [
      { createdBy: req.user._id, taskType: "Personal" },
      { group: { $in: groupIds }, taskType: "Group" },
    ],
  };

  const tasksCount = await Task.countDocuments(filter);
  const apiFeatures = new ApiFeatures(Task.find(filter), req.query)
    .filter()
    .sort()
    .search()
    .limitFields()
    .paginate(tasksCount);

  const tasks = await apiFeatures.mongooseQuery;

  res.status(200).json({
    status: "success",
    results: tasks.length,
    pagination: apiFeatures.paginationResult,
    data: tasks,
  });
});

//! Get specific task
// @Route GET /api/v1/tasks/:id
// @Access Private member and admin can get the task in group
export const getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  console.log(task);
  if (!task) return next(new apiError("Task not found", 404));

  // Personal task check
  if (task.taskType === "Personal") {
    if (!task.createdBy.equals(req.user._id)) {
      return next(new apiError("Unauthorized access", 403));
    }
  }
  // Group task check
  else {
    const isMember = await GroupMember.exists({
      group: task.group,
      user: req.user._id,
    });
    if (!isMember) return next(new apiError("Not a group member", 403));
  }

  res.status(200).json({
    status: "success",
    data: task,
  });
});

//! Update task
// @Route PUT /api/v1/tasks/:id
// @Access Private admin only can update the task
export const updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new apiError("Task not found", 404));

  // Personal task
  if (task.taskType === "Personal") {
    if (!task.createdBy.equals(req.user._id)) {
      return next(new apiError("Unauthorized access", 403));
    }
  }
  // Group task
  else {
    const isAdmin = await GroupMember.exists({
      group: task.group,
      user: req.user._id,
      role: "admin",
    });
    if (!isAdmin) return next(new apiError("Admin privileges required", 403));
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    data: updatedTask,
  });
});

//! Delete task
// @Route DELETE /api/v1/tasks/:id
// @Access Private admin only can delete group task
export const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new apiError("Task not found", 404));

  // Personal task
  if (task.taskType === "Personal") {
    if (!task.createdBy.equals(req.user._id)) {
      return next(new apiError("Unauthorized access", 403));
    }
  }
  // Group task
  else {
    const isAdmin = await GroupMember.exists({
      group: task.group,
      user: req.user._id,
      role: "admin",
    });
    if (!isAdmin) return next(new apiError("Admin privileges required", 403));
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    message: "Task deleted successfully",
    data: null,
  });
});
