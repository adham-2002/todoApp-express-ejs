import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  createFilterObject,
} from "../services/taskService.js";
import { protect } from "../services/authService.js";
import checkGroupRole from "../middlewares/groupRoleMiddleware.js";
import {
  createTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} from "../utils/validators/taskValidator.js";
const router = express.Router({ mergeParams: true });

router
  .post(
    "/",
    createTaskValidator,
    protect,
    checkGroupRole(["admin"]),
    createTask
  )
  .get("/", protect, checkGroupRole(["admin", "member"]), getTasks)
  .put(
    "/:id",
    updateTaskValidator,
    protect,
    checkGroupRole(["admin", "member"]),
    updateTask
  )
  .delete(
    "/:id",
    deleteTaskValidator,
    protect,
    checkGroupRole(["admin"]),
    deleteTask
  );

export default router;
