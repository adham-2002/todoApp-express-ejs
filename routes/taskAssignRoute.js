import express from "express";
import {
  createTaskAssign,
  getTaskAssign,
  updateTaskAssign,
  deleteTaskAssign,
  createFilterObject,
} from "../services/taskAssignService.js";
const router = express.Router();
import { protect } from "../services/authService.js";
router
  .post("/", protect, createTaskAssign)
  .get("/", protect, getTaskAssign)
  .put("/:id", taskAssignValidator, protect, updateTaskAssign)
  .delete("/:id", protect, deleteTaskAssign);
export default router;

/// what i want when create a task
// 1- i want to check if the user inside the group
// 2- i want to check if the user who want to assign is the admin of the group or not so i want to pass the group id and the user id to the taskAssignService
// 3- i want to check if the task is already assigned to the user or not
// 4- i want to check if the task is exist or not
// how will i pass the
