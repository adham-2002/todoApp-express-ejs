import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";

export const createTask = asyncHandler(async (req, res, next) => {
  const { title, dueDate } = req.body;

  const task = await Task.create({
    title,
    dueDate,
    user: req.user._id,
  });
  res.status(201).json({ status: "success", data: task });
});
