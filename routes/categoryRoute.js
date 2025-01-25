import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";
import { protect } from "../services/authService.js";
//! we need validation here don't forget

const router = express.Router();

router
  .post("/", protect, createCategory)
  .get("/", protect, getCategories)
  .put("/:id", protect, updateCategory)
  .delete("/:id", protect, deleteCategory);

export default router;
