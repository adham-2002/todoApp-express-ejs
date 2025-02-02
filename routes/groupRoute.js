import express from "express";
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
} from "../services/groupService.js";
import { generateJoinLink, joinGroup } from "../services/groupMemberService.js";
import groupMemberRouter from "./groupMemberRoute.js";
import checkGroupRole from "../middlewares/groupRoleMiddleware.js";
import { protect } from "../services/authService.js";
import taskRouter from "./taskRoute.js";

const router = express.Router();

router.route("/").get(protect, getGroups).post(protect, createGroup);

router
  .route("/:groupId")
  .get(protect, checkGroupRole("member"), getGroup)
  .put(protect, checkGroupRole("admin"), updateGroup)
  .delete(protect, checkGroupRole("admin"), deleteGroup);

// Endpoint to generate join link
router
  .route("/:groupId/join-link")
  .post(protect, checkGroupRole("admin"), generateJoinLink);

// Endpoint to handle join request
router.route("/join/:token").get(protect, joinGroup);

// Nested routes for group members
router.use("/:groupId/members", groupMemberRouter);
router.use("/:groupId/tasks", taskRouter);
export default router;
