import express from "express";
import {
  createTaskAssignment,
  getAssignedTasks,
  getSpecificTask,
} from "../services/taskAssignService.js";
const router = express.Router();
import { protect } from "../services/authService.js";
router
  .post("/", protect, createTaskAssignment)
  .get("/", protect, getAssignedTasks)
  .get("/:id", protect, getSpecificTask);

export default router;
