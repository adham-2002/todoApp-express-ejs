import express from "express";
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
} from "../services/groupService.js";
import groupMemberRouter from "./groupMemberRoute.js";
import checkGroupRole from "../middlewares/groupRoleMiddleware.js";
import { protect } from "../services/authService.js";
const router = express.Router();
router.route("/").get(protect, getGroups).post(protect, createGroup);
router
  .route("/:groupId")
  .get(protect, checkGroupRole("admin"), getGroup)
  .put(protect, checkGroupRole("admin"), updateGroup)
  .delete(protect, checkGroupRole("admin"), deleteGroup);
// nested routes for group members
router.use("/:groupId/members", groupMemberRouter);
export default router;
