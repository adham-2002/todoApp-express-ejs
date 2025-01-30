import express from "express";
import {
  addGroupMember,
  getGroupMembers,
  getGroupMember,
  updateGroupMember,
  deleteGroupMember,
} from "../services/groupMemberService.js";
import { protect } from "../services/authService.js";
import checkGroupRole from "../middlewares/groupRoleMiddleware.js";
const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/")
  .get(checkGroupRole(["admin", "member"]), getGroupMembers)
  .post(checkGroupRole(["admin"]), addGroupMember);
router
  .route("/:memberId")
  .get(checkGroupRole(["admin", "member"]), getGroupMember)
  .put(checkGroupRole(["admin"]), updateGroupMember)
  .delete(checkGroupRole(["admin"]), deleteGroupMember);

export default router;
