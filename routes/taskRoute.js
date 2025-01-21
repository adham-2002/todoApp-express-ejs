import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskService.js";
import { protect } from "../services/authService.js";
import {
  createTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} from "../utils/validators/taskValidator.js";

const router = express.Router();

router
  .post("/", createTaskValidator, protect, createTask)
  .get("/", protect, getTasks)
  .put("/:id", updateTaskValidator, protect, updateTask)
  .delete("/:id", deleteTaskValidator, protect, deleteTask);

export default router;
