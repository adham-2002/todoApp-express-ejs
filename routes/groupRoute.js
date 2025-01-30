import express from "express";
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
} from "../services/groupService.js";
import isGroupAdmin from "../middlewares/isGroupAdmin.js";
import { protect } from "../services/authService.js";
const router = express.Router();
router.route("/").get(protect, getGroups).post(protect, createGroup);
router
  .route("/:id")
  .get(protect, isGroupAdmin, getGroup)
  .put(protect, isGroupAdmin, updateGroup)
  .delete(protect, isGroupAdmin, deleteGroup);
export default router;
