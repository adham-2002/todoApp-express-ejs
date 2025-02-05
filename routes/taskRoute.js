import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../services/tasksService.js";
import { protect } from "../services/authService.js";
import {
  createTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} from "../utils/validators/taskValidator.js";
const router = express.Router();
router.use(protect);
router
  .post("/", createTaskValidator, protect, createTask)
  .get("/", getTasks)
  .get("/:id", getTask)
  .put("/:id", updateTaskValidator, protect, updateTask)
  .delete("/:id", deleteTaskValidator, protect, deleteTask);

export default router;
