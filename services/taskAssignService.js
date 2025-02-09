import TaskAssignment from "../models/taskAssignmentModel.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeature.js";
import GroupMember from "../models/groupMembersModel.js";

export const createTaskAssignment = asyncHandler(async (req, res, next) => {
  // 1) Get task, assignedTo, and group from the request body
  const { taskId, assignedTo, group } = req.body;

  // 2) Check if the user is an admin of the group
  const isAdmin = await GroupMember.exists({
    group: group,
    user: req.user._id,
    role: "admin",
  });
  if (!isAdmin) {
    return next(new apiError("You are not an admin of this group", 403));
  }

  // 3) Check if the assigned task-user is a member of the group
  const isMember = await GroupMember.exists({
    group: group,
    user: assignedTo,
  });
  if (!isMember) {
    return next(
      new apiError(
        "User you want to assign the task to is not a member of this group",
        403
      )
    );
  }

  // 4) Check if the task exists for the specific group and was created by the admin
  const task = await Task.findOne({
    _id: taskId,
    group: group,
    createdBy: req.user._id,
  });
  if (!task) {
    return next(
      new apiError("Can't find the task. Make sure you assigned it.", 404)
    );
  }

  // 5) Check if the task is already assigned to the user
  const isAssigned = await TaskAssignment.exists({
    task: taskId,
    assignedTo: assignedTo,
    group: group,
  });
  if (isAssigned) {
    return next(new apiError("Task already assigned to the user", 400));
  }

  // Create the task assignment
  const taskAssignment = await TaskAssignment.create({
    task: taskId,
    assignedTo: assignedTo,
    assignedBy: req.user._id,
    group: group,
  });

  res.status(200).json({
    status: "success",
    message: "Task assigned successfully",
    data: taskAssignment,
  });
});

// Get assigned tasks for a logged-in user
// Route: GET /api/v1/assignments
// Access: Private (member and admin)
export const getAssignedTasks = asyncHandler(async (req, res, next) => {
  const taskCount = await TaskAssignment.countDocuments({
    assignedTo: req.user._id,
  });

  const query = new ApiFeatures(
    TaskAssignment.find({ assignedTo: req.user._id }).populate(
      "task group assignedTo assignedBy"
    ),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .search()
    .paginate(taskCount);

  const assignedTasks = await query.mongooseQuery;

  if (!assignedTasks || assignedTasks.length === 0) {
    return next(new apiError("No tasks assigned to you", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Tasks retrieved successfully",
    count: assignedTasks.length,
    pagination: query.paginationResult,
    data: assignedTasks,
  });
});
// Get Specific task
export const getSpecificTask = asyncHandler(async (req, res, next) => {
  // // check first if the user is member of this group
  // const isMember = await GroupMember.exists({
  //   group: req.params.groupId,
  //   user: req.user._id,
  // });
  // if (!isMember) {
  //   return next(new apiError("You are not a member of this group", 403));
  // }
  const task = await TaskAssignment.findById(req.params.id).populate("task");

  if (!task) {
    return next(new apiError("Task not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Task retrieved successfully",
    data: task,
  });
});

export const deleteTaskAssignment = asyncHandler(async (req, res, next) => {
  const taskAssignment = await TaskAssignment.findById(req.params.id);
  if (!taskAssignment) {
    return next(new apiError("Task assignment not found", 404));
  }
  await TaskAssignment.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Task assignment deleted successfully",
  });
});
