import TaskAssignment from "../models/taskAssignmentModel.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import apiError from "../utils/apiError.js";

export const assignTask = async (req, res, next) => {
  const { taskId, userId } = req.body;
  const task = await Task.findById(taskId);
  const user = await User.findById(userId);
  if (!task) {
    return next(new apiError("Task not found", 404));
  }
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  // check if the task assignment already exists
  const isAssigned = await TaskAssignment.findOne({
    task: taskId,
    assignedTo: userId,
  });
  if (isAssigned) {
    return next(new apiError("Task already assigned to the user", 400));
  }
  const taskAssignment = await TaskAssignment.create({
    task: taskId,
    assignedTo: userId,
    assignedBy: req.user._id,
  });
  res.status(200).json({
    status: "success",
    message: "Task assigned successfully",
    data: taskAssignment,
  });
};
export const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.groupId) {
    filterObject = { group: req.params.groupId };
  }
  req.filterObject = filterObject;
  next();
};

// get assigned tasks for a logged in user

export const getAssignedTasks = async (req, res, next) => {
  let filter = req.filterObject || {};
  const tasks = await TaskAssignment.find({
    ...filter,
    assignedTo: req.user._id,
  }).populate("task");
  res.status(200).json({
    status: "success",
    message: "Tasks fetched successfully",
    data: tasks,
  });
};
