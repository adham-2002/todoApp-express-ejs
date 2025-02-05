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
import authorizeGroupAdmin from "../middlewares/groupRoleMiddleware.js";
import { protect } from "../services/authService.js";

const router = express.Router();

router.route("/").get(protect, getGroups).post(protect, createGroup);

router
  .route("/:groupId")
  .get(protect, authorizeGroupAdmin("member"), getGroup)
  .put(protect, authorizeGroupAdmin("admin"), updateGroup)
  .delete(protect, authorizeGroupAdmin("admin"), deleteGroup);

// Endpoint to generate join link
router
  .route("/:groupId/join-link")
  .post(protect, authorizeGroupAdmin("admin"), generateJoinLink);

// Endpoint to handle join request
router.route("/join/:token").get(protect, joinGroup);

// Nested routes for group members
router.use("/:groupId/members", groupMemberRouter);
// Nested Route for group tasks
export default router;
