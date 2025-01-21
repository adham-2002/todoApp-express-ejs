import express from "express";
import { createTask } from "../services/taskService.js";
import { protect } from "../services/authService.js";
import { createTaskValidator } from "../utils/validators/taskValidator.js";

const router = express.Router();

router.post("/", createTaskValidator, protect, createTask);

export default router;
