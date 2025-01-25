import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";
import { protect } from "../services/authService.js";
import taskRouter from "./taskRoute.js";
//! we need validation here don't forget

const router = express.Router();
// Nested Routes for tasks under categories
router.use("/:categoryId/tasks", taskRouter);

router
  .post("/", protect, createCategory)
  .get("/", protect, getCategories)
  .put("/:id", protect, updateCategory)
  .delete("/:id", protect, deleteCategory);

export default router;
