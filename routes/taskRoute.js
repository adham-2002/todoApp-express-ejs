import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  createFilterObject,
} from "../services/taskService.js";
import { protect } from "../services/authService.js";
import {
  createTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} from "../utils/validators/taskValidator.js";
const router = express.Router({ mergeParams: true });

router
  .post("/", createTaskValidator, protect, createTask)
  .get("/", protect, createFilterObject, getTasks)
  .put("/:id", updateTaskValidator, protect, updateTask)
  .delete("/:id", deleteTaskValidator, protect, deleteTask);

export default router;
