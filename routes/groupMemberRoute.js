import express from "express";
import {
  addGroupMember,
  getGroupMembers,
  getGroupMember,
  updateGroupMember,
  deleteGroupMember,
} from "../services/groupMemberService.js";
import { protect } from "../services/authService.js";
import authorizeGroupAdmin from "../middlewares/groupRoleMiddleware.js";
const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/")
  .get(authorizeGroupAdmin(["admin", "member"]), getGroupMembers)
  .post(authorizeGroupAdmin(["admin"]), addGroupMember);
router
  .route("/:memberId")
  .get(authorizeGroupAdmin(["admin", "member"]), getGroupMember)
  .put(authorizeGroupAdmin(["admin"]), updateGroupMember)
  .delete(authorizeGroupAdmin(["admin"]), deleteGroupMember);

export default router;
